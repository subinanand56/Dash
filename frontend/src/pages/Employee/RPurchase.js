import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const RPurchase = () => {
  const [branches, setBranches] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([
    {
      productName: "",
      companyName: "",
      price: "",
      photo: null,
    },
  ]);
  const [selectedBranch, setSelectedBranch] = useState("");

 
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const branch = authData?.user?.branch;

    if (authData && authData.success) {
      setSelectedBranch(branch);
    } else {
      console.log("User is not authenticated");
    }
  }, []);

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

  const handleAddPurchaseRequest = () => {
    setPurchaseRequests([
      ...purchaseRequests,
      {
        productName: "",
        companyName: "",
        price: "",
        photo: null,
      },
    ]);
  };

  const handlePurchaseRequestInputChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedPurchaseRequests = [...purchaseRequests];
    if (name === "photo") {
      updatedPurchaseRequests[index][name] = files[0];
    } else {
      updatedPurchaseRequests[index][name] = value;
    }
    setPurchaseRequests(updatedPurchaseRequests);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const userId = authData?.user?._id;
      console.log("userId:", userId);

      const promises = purchaseRequests.map(async (request) => {
        
        const productData = new FormData();
        productData.append("productName", request.productName);
        productData.append("companyName", request.companyName);
        productData.append("price", request.price);
        productData.append("branch", selectedBranch);
        productData.append("photo", request.photo);
        productData.append("user", userId);
        console.log("Request data:", request); 

        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/purchaserqst/add-purchaserqst`,
          productData
        );
        return data;
      });

      const responses = await Promise.all(promises);

      const success = responses.every((res) => res.success);

      if (success) {
        toast.success("Purchase requests added successfully");
        window.location.reload();
      } else {
        toast.error("Failed to add purchase requests");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const promises = purchaseRequests.map(async (request) => {
  //       const productData = new FormData();
  //       productData.append("productName", request.productName);
  //       productData.append("companyName", request.companyName);
  //       productData.append("price", request.price);
  //       productData.append("branch", selectedBranch);
  //       productData.append("photo", request.photo);
        

  //       const { data } = await axios.post(
  //         `${process.env.REACT_APP_API}/api/v1/purchaserqst/add-purchaserqst`,
  //         productData
  //       );
  //       return data;
  //     });

  //     const responses = await Promise.all(promises);

  //     const success = responses.every((res) => res.success);

  //     if (success) {
  //       toast.success("Purchase requests added successfully");
  //       window.location.reload();
  //     } else {
  //       toast.error("Failed to add purchase requests");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Network Error: Unable to connect to the API server");
  //   }
  // };

  return (
    <Container>
      <h2 className="text-center pt-3">Multiple Purchase Requests</h2>
      <Form onSubmit={handleSubmit}>
        {purchaseRequests.map((request, index) => (
          <div key={index}>
            <Row>
              <Col md={6}>
                <Form.Group controlId={`branch-${index}`}>
                  <Form.Label>Branch:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      branches.find((b) => b._id === selectedBranch)?.name || ""
                    }
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId={`productName-${index}`}>
                  <Form.Label>Product Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={request.productName}
                    onChange={(e) => handlePurchaseRequestInputChange(index, e)}
                    name="productName"
                  />
                </Form.Group>

                <Form.Group controlId={`companyName-${index}`}>
                  <Form.Label>Company Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={request.companyName}
                    onChange={(e) => handlePurchaseRequestInputChange(index, e)}
                    name="companyName"
                  />
                </Form.Group>

                <Form.Group controlId={`price-${index}`}>
                  <Form.Label>Price:</Form.Label>
                  <Form.Control
                    type="text"
                    value={request.price}
                    onChange={(e) => handlePurchaseRequestInputChange(index, e)}
                    name="price"
                  />
                </Form.Group>

                <Form.Group controlId={`photo-${index}`}>
                  <Form.Label>Photo:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handlePurchaseRequestInputChange(index, e)}
                    name="photo"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}

        <div className="text-center pt-3">
          <Button
            variant="primary"
            onClick={handleAddPurchaseRequest}
            className="m-2"
          >
            Add More
          </Button>
          <Button variant="primary" type="submit">
            Submit 
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RPurchase;
