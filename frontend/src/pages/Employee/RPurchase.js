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
      date: "",
    },
  ]);
  const [selectedBranch, setSelectedBranch] = useState("");

 
  useEffect(() => {

    const branchFromLocalStorage = localStorage.getItem("branch");
  
    if (branchFromLocalStorage) {
      setSelectedBranch(branchFromLocalStorage);
    }
  }, []);
 



  const handleAddPurchaseRequest = () => {
    setPurchaseRequests([
      ...purchaseRequests,
      {
        productName: "",
        companyName: "",
        price: "",
        photo: null,
        date: "",
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

    
  };


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
                    value={selectedBranch}
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
