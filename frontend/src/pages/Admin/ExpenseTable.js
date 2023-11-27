import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const ExpenseTable = () => {
  const [branches, setBranches] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  useEffect(() => {
    fetchBranches();
    setDefaultDateRange();
  }, []);

  const setDefaultDateRange = () => {
    const currentDate = new Date();
    const defaultFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const defaultToDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    setFromDate(defaultFromDate.toISOString().split('T')[0]);
    setToDate(defaultToDate.toISOString().split('T')[0]);
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:8081/getbranch");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  };

  useEffect(() => {
    if (selectedBranch === 'all') {
      handleDateRangeSelect();
    } else {
      fetchExpenseData (selectedBranch);
    }
  }, [selectedBranch, fromDate, toDate]);

  const handleDateRangeSelect = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/getexpenses`);
      setExpensesData(filterExpensesByDate(response.data));
    } catch (error) {
      console.error('Error fetching sales data: ', error);
      toast.error('Failed to fetch sales data');
      setExpensesData([]);
    }
  };

  const fetchExpenseData = async (branchId) => {
    try {
      const response = await axios.get(`http://localhost:8081/getexpenses?branch=${branchId}`);
      setExpensesData(filterExpensesByDate(response.data));
    } catch (error) {
      console.error('Error fetching expense data: ', error);
      toast.error('Failed to fetch expense data');
      setExpensesData([]);
    }
  };
  const filterExpensesByDate = (data) => {
    const fromDateValue = fromDate ? new Date(fromDate) : null;
    const toDateValue = toDate ? new Date(toDate) : null;
  
    const filteredExpensesData = data.filter((expense) => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
  
      if (fromDateValue && toDateValue) {
        return expenseDate >= fromDateValue && expenseDate <= toDateValue;
      } else if (fromDateValue && !toDateValue) {
        return expenseDate >= fromDateValue;
      } else if (!fromDateValue && toDateValue) {
        return expenseDate <= toDateValue;
      } else {
        return true;
      }
    });
  
    return filteredExpensesData;
  };
  
  const calculateTotalAmount = () => {
    return expensesData.reduce((total, expense) => total + expense.price, 0);
  };
  return (
    <div>
      <h5>Expenses</h5>
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
          {expensesData.map((expense, index) => (
              <tr key={index}>
                <td>{expense.branch}</td>
                <td>{expense.item}</td>
                <td>{expense.price}</td>
                
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Total Amount:</strong></td>
              <td colSpan="3">{calculateTotalAmount()}</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseTable;
