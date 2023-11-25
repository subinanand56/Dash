import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import axios from "axios";
import { Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import { Select } from "antd";

const { Option } = Select;

const ProductForm = () => {
 
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");
 
  const [products, setProducts] = useState([]);

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

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/add-product`,
        {
          name,
          
        }
      );
      if (data?.success) {
        toast.error(data?.message);
        window.location.reload();
      } else {
        toast.success("Product Created Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <ProductContainer>
      <Row className="mt-5 justify-content-center">
        <Col md={12} lg={6} className="mb-5">
          <Card>
            <Card.Body>
              <h2 className="text-center pt-3">Products</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col  md={12} lg={6}>
          <Card>
            <Card.Body className="text-center">
              <h2 className="text-center pt-3"> Add Products</h2>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Enter new product"
                    onChange={(e) => setName(e.target.value)}
                  />
                  
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Product
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ProductContainer>
  );
};

const ProductContainer = styled.div``;

export default ProductForm;
