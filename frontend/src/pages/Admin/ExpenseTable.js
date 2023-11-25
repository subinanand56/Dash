import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const ExpenseTable = () => {
  const [branches, setBranches] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getAllBranches = async () => {
    try {
      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/branch/get-branch`
      );
      if (response.data?.success) {
        setBranches(response.data.branch);
      } else {
        toast.error(
          response.data?.message || "Something went wrong in getting branches"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };

  const getAllExpenses = async () => {
    try {
      let endpoint = `https://web-final-etmp.onrender.com/api/v1/expense/all-expense`;

      if (selectedBranch !== "all") {
        endpoint = `https://web-final-etmp.onrender.com/api/v1/expense/all-expense/${selectedBranch}`;
      }

      const response = await axios.get(endpoint);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses. Please try again.");
    }
  };

  useEffect(() => {
    getAllBranches();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setFromDate(oneMonthAgo.toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    getAllBranches();
    getAllExpenses();
    handleDateRangeSelect();
  }, [selectedBranch, fromDate, toDate]);

  const handleDateRangeSelect = async () => {
    try {
      let endpoint = `https://web-final-etmp.onrender.com/api/v1/expense/all-expense`;

      if (selectedBranch !== "all") {
        endpoint = `https://web-final-etmp.onrender.com/api/v1/expense/all-expense/${selectedBranch}`;
      }

      const response = await axios.get(endpoint);

      const filteredExpenses = response.data.expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt).getTime();
        const fromDateTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
        let toDateTimestamp = toDate
          ? new Date(toDate).getTime()
          : Number.MAX_SAFE_INTEGER;
        toDateTimestamp = new Date(
          toDateTimestamp + 24 * 60 * 60 * 1000
        ).getTime();

        return (
          expenseDate >= fromDateTimestamp && expenseDate <= toDateTimestamp
        );
      });

      setExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses. Please try again.");
    }
  };

  const getTotalAmount = () => {
    const totalAmount = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return totalAmount.toFixed(2); // Assuming 2 decimal places for amount
  };

  const generateAndDownloadExpensesCSV = () => {
    const headers = ["Branch", "Expense Name", "Amount"];
    const csvContent = [
      headers.join(","), // Header row
      ...expenses.map((expense) => {
        const branchName =
          selectedBranch === "all"
            ? expense.branch.name
            : branches.find((branch) => branch._id === selectedBranch)?.name ||
              "";

        return [branchName, expense.expenseName, expense.amount].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  return (
    <div>
      <h1>Expenses</h1>
      <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="all">All</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name}
          </option>
        ))}
      </select>
      <label>
        From:
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </label>
      <label>
        To:
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </label>
      <Button className='m-1' variant="primary" onClick={generateAndDownloadExpensesCSV}>
          Download
        </Button>
      <div>
       
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Expense Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const branchName =
                selectedBranch === "all"
                  ? expense.branch.name
                  : branches.find((branch) => branch._id === selectedBranch)
                      ?.name || "";

              return (
                <tr key={expense._id}>
                  <td>{branchName}</td>
                  <td>{expense.expenseName}</td>
                  <td>{expense.amount}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Total Amount:</strong></td>
              <td>{getTotalAmount()}</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseTable;
