import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const SalesForm = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [sales, setSales] = useState([
    {
      name: "",
      amount: "",
      quantity: "",
      quantityUnit: "ton",
    },
  ]);
  const [products, setProducts] = useState([]);

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

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/product/get-product`
      );
      if (response.data?.success) {
        setProducts(response.data.product);
      } else {
        toast.error(
          response.data?.message || "Something went wrong in getting products"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };

  useEffect(() => {
    getAllBranches();
    getAllProducts();
  }, []);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const branch = authData?.user?.branch;

    if (authData && authData.success) {
      setSelectedBranch(branch);
    } else {
      console.log("User is not authenticated");
    }
  }, []);

  const handleAddSale = () => {
    setSales([
      ...sales,
      {
        name: "",
        amount: "",
        quantity: "",
        quantityUnit: "ton",
      },
    ]);
  };

  const handleSaleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSales = [...sales];
    updatedSales[index][name] = value;
    setSales(updatedSales);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const promises = sales.map(async (sale) => {
        const response = await axios.post(
          `https://web-final-etmp.onrender.com/api/v1/sales/add-sale`,
          {
            name: sale.name,
            amount: sale.amount,
            quantity: sale.quantity,
            quantityUnit: sale.quantityUnit,
            branch: selectedBranch,
          }
        );
        return response.data;
      });

      const responses = await Promise.all(promises);

      const success = responses.every((res) => res.success);

      if (success) {
        toast.success("Sales added successfully");
        window.location.reload();
      } else {
        toast.error("Failed to add sales");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };

  return (
    <Container>
      <h2 className="text-center pt-3">Daily Sales Entry</h2>
      <Form onSubmit={handleSubmit}>
        {sales.map((sale, index) => (
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

                <Form.Group controlId={`saleItem-${index}`}>
                  <Form.Label>Sale Product:</Form.Label>
                  <Form.Control
                    as="select"
                    value={sale.name}
                    onChange={(e) => handleSaleInputChange(index, e)}
                    name="name"
                  >
                    <option value="" disabled>
                      Select a Product
                    </option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId={`amount-${index}`}>
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control
                    type="number"
                    value={sale.amount}
                    onChange={(e) => handleSaleInputChange(index, e)}
                    name="amount"
                  />
                </Form.Group>

                <Form.Group controlId={`quantity-${index}`}>
                  <Form.Label>Quantity:</Form.Label>
                  <Row>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        value={sale.quantity}
                        onChange={(e) => handleSaleInputChange(index, e)}
                        name="quantity"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        value={sale.quantityUnit}
                        onChange={(e) => handleSaleInputChange(index, e)}
                        name="quantityUnit"
                      >
                        <option value="ton">ton</option>
                        <option value="kg">kg</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}

        <div className="text-center pt-3 ">
          <Button variant="primary" onClick={handleAddSale} className="m-2">
            Add More Sale
          </Button>
          <Button variant="primary" type="submit" >
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SalesForm;
