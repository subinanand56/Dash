import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Table } from "react-bootstrap";

const Epurchase = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();

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

  const getAllPurchaseRequests = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const userId = authData?.user?._id;
  
      if (!userId) {
        toast.error("User ID not found in local storage");
        return;
      }
  
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/purchaserqst/all-purchase/${userId}`
      );
  
      if (response.data?.success) {
        setPurchaseRequests(response.data.purchaseRequests);
      } else {
        toast.error(
          response.data?.message || "Something went wrong in getting purchase requests"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };
  
  

  useEffect(() => {
    getAllBranches();
    getAllPurchaseRequests();
  }, []); 

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const branchId = authData?.user?.branch;

    if (authData && authData.success) {
      const foundBranch = branches.find(branch => branch._id === branchId);
      setSelectedBranch(foundBranch?.name || "Unknown Branch");
    } else {
      console.log("User is not authenticated");
    }
  }, [branches]); 

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const role = authData?.user?.role;
    const token = authData?.token;

    if (role ==="employee" && token) {
      navigate("/employee-dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]); 

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Purchase Requests Status</h2>
      <Table striped bordered  responsive>
        <thead>
          <tr>
            <th>Branch</th>
            <th>Product Name</th>
            <th>Company Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchaseRequests.map((request) => (
            <tr key={request._id}>
              <td>{selectedBranch}</td>
              <td>{request.productName}</td>
              <td>{request.companyName}</td>
              <td>{request.accepted ? "Accepted" : "Not Accepted"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Epurchase;
