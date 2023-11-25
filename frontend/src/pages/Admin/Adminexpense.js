import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const Adminexpense = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [expenses, setExpenses] = useState([
    {
      expenseItem: "",
      amount: "",
      receipt: null,
    },
  ]);

  const getAllBranches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/branch/get-branch`
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

  useEffect(() => {
    getAllBranches();
  }, []);

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        expenseItem: "",
        amount: "",
        receipt: null,
      },
    ]);
  };
  const handleExpenseInputChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const promises = expenses.map(async (expense) => {
        const { expenseItem, amount } = expense;

        try {
          const response = await axios.post(
            `https://web-final-etmp.onrender.com/api/v1/expense/add-expense`,
            {
              expenseName: expenseItem,
              amount: Number(amount),
              branch: selectedBranch,
            }
          );
          return response.data;
        } catch (error) {
          console.error(error);
          return { success: false };
        }
      });

      const responses = await Promise.all(promises);

      const success = responses.every((res) => res.success);

      if (success) {
        toast.success("Expenses added successfully");
        window.location.reload();
      } else {
        toast.error("Failed to add expenses");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };

  return (
    <Container>
      <h5 className="text-center pt-3">Daily Expense Entry</h5>
      <Form onSubmit={handleSubmit}>
        {expenses.map((expense, index) => (
          <div key={index}>
            <Row>
              <Col md={6}>
                <Form.Group controlId={`branch-${index}`}>
                  <Form.Label>Branch:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">Select a Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId={`expenseItem-${index}`}>
                  <Form.Label>Expense Item:</Form.Label>
                  <Form.Control
                    type="text"
                    value={expense.expenseItem}
                    onChange={(e) =>
                      handleExpenseInputChange(
                        index,
                        "expenseItem",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId={`amount-${index}`}>
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      handleExpenseInputChange(index, "amount", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}

        <div className="text-center pt-3">
          <Button variant="primary" onClick={handleAddExpense} className="m-2">
            Add More Expense
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Adminexpense;
