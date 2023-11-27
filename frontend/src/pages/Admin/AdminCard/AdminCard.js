import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Row, Col, Form } from "react-bootstrap";

const CompactCard = () => {
  const [selectedOption, setSelectedOption] = useState("day");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [branches, setBranches] = useState([]);
  const [salesAmount, setSalesAmount] = useState("");
  const [expensesAmount, setExpensesAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <AdminCardContainer>
      <motion.ul
        className="CompactCard "
        style={{
          background: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
          boxShadow: "0px 10px 20px 0px #e0c6f5",
        }}
      >
        <div className="radialBar">
          <span>Sales</span>

          <span>Expenses</span>

          <span>Purchase</span>
        </div>
        <div className="radialBar">
          <span>Rs {salesAmount}</span>

          <span>Rs {expensesAmount}</span>

          <span>Rs {purchaseAmount}</span>
        </div>

        <div className="Row">
        <Row>
          <Col>
            <Form.Select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="all">All</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Form.Label>From:</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>To:</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Col>
        </Row>
        </div>
      </motion.ul>
    </AdminCardContainer>
  );
};
const AdminCardContainer = styled.div`
  .CompactCard {
    display: flex;
    flex: 1;
    height: 12rem !important;
    border-radius: 0.7rem;
    color: white;
    padding: 1rem;
    position: relative;
    cursor: pointer;
  }
  .CompactCard:hover {
    box-shadow: none !important;
  }
  .radialBar {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1rem;
  }

  .radialBar > span {
    font-size: 17px;
    font-weight: bold;
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
  }

  @media screen and (max-width: 768px) {
    .CompactCard {
      width: 100%;
      margin-bottom: 1rem;
    }

    .CompactCard .Row > div {
      width: 55%;
      margin-right: 0%;
    }
    .CompactCard .Row {
      width: 100%;
      margin-top: 1rem;  
    }

    .rowContainer {
      margin-bottom: 1rem; 
    }
  }
`;
export default CompactCard;
