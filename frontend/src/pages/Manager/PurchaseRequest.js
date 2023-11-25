import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const PurchaseRequests = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const getAllBranches = async () => {
    try {
      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/branch/get-branch`
      );
      if (response.data?.success) {
        const branches = response.data.branch;
        setBranches(branches);
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
      const branchId = authData?.user?.branch;

      if (!branchId) {
        toast.error("Branch ID not found in local storage");
        return;
      }

      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/purchaserqst/all-purchase-requests/${branchId}`
      );

      if (response.data?.success) {
        setPurchaseRequests(response.data.purchaseRequests);
      } else {
        toast.error(
          response.data?.message ||
            "Something went wrong in getting purchase requests"
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
      const foundBranch = branches.find((branch) => branch._id === branchId);
      setSelectedBranch(foundBranch?.name || "Unknown Branch");
    } else {
      console.log("User is not authenticated");
    }
  }, [branches]);

  const fetchImage = async (id) => {
    try {
      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/purchaserqst/purchase-photo/${id}`,
        {
          responseType: "blob", // Ensure binary response (for images)
        }
      );
      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch the image");
    }
  };

  const handleViewImage = (id) => {
    if (selectedImage) {
      setSelectedImage(null);
    } else {
      fetchImage(id);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `https://web-final-etmp.onrender.com/api/v1/purchaserqst/update-purchase/${id}`,
        { accepted: newStatus }
      );

      if (response.data?.success) {
        const updatedRequests = purchaseRequests.map((request) =>
          request._id === id ? { ...request, accepted: newStatus } : request
        );
        setPurchaseRequests(updatedRequests);
        toast.success(
          `Purchase request status updated to ${
            newStatus ? "Accepted" : "Not Accepted"
          }`
        );
      } else {
        toast.error(
          response.data?.message || "Failed to update purchase request status"
        );
      }
    } catch (error) {
      console.error("Network Error: Unable to connect to the API server", error);
      toast.error("Failed to update purchase request status");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Purchase Requests Status</h2>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Branch</th>
            <th>Product Name</th>
            <th>Company Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {purchaseRequests.map((request) => (
            <tr key={request._id}>
              <td>{selectedBranch}</td>
              <td>{request.productName}</td>
              <td>{request.companyName}</td>
              <td>{request.price}</td>
              <td>{request.accepted ? "Accepted" : "Not Accepted"}</td>
              <td>
                <Button
                  variant={request.accepted ? "danger" : "success"}
                  onClick={() =>
                    handleUpdateStatus(request._id, !request.accepted)
                  }
                >
                  {request.accepted ? "Reject" : "Accept"}
                </Button>
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleViewImage(request._id)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedImage && (
        <div className="image-modal text-center mt-4">
          <img src={selectedImage} alt="Selected" className="selected-image"  style={{ maxWidth: "90%", height: "auto" }} />
          <div className="button-container">
            <Button variant="danger" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;
