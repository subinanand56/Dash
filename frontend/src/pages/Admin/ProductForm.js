import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import axios from "axios";
import { Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import { Modal } from "antd";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:8081/product", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error("Failed to add product. Please try again.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (product) => {
    if (selectedProduct === product) {
      setSelectedProduct(null);
      setSelected(null);
    } else {
      setSelectedProduct(product);
      setSelected(product);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/updatebranch/${selectedProduct?.id}`,
        {
          name: updatedName || selectedProduct?.name,
        }
      );
      if (response.data?.success) {
        toast.success(`Product updated successfully`);
        fetchProducts();
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Error updating product: ", error);
    }
  };

 
  const handleDelete = async () => {};
  return (
    <ProductContainer>
      <Row className="mt-5 justify-content-center">
        <Col md={12} lg={6} className="mb-5">
          <Card>
            <Card.Body>
              <Modal
                onCancel={() => setVisible(false)}
                footer={null}
                visible={visible}
              >
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      className="mb-3"
                      type="text"
                      placeholder="Enter new product"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Form>
              </Modal>
              <h2 className="text-center pt-3">Products</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td onClick={() => handleRowClick(product)}>
                        {product.name}
                      </td>
                      <td onClick={() => handleRowClick(product)}>
                        {selectedProduct === product && (
                          <>
                            <Button
                              variant="primary ms-2"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(product.name);
                                setSelected(product);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger ms-2"
                              onClick={() => {
                                handleDelete(product.bid);
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={6}>
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
                  Create
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
