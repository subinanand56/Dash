import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import axios from "axios";
import { Button, Table, Card, Row, Col } from "react-bootstrap";
import AddBranchForm from "./AddBranchForm";
import { Modal } from "antd";

const BranchForm = () => {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []); // Fetch branches on component mount

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:8081/getbranch");
      setBranches(response.data); // Update branches state with fetched data
    } catch (error) {
      console.error("Error fetching branches: ", error);
      // Handle fetch error here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/branch", {
        name,
      });
      if (response.data.success) {
        toast.success("Branch added successfully");
        setName("");
        fetchBranches(); // Fetch branches after adding a new branch
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add branch");
      console.error("Error adding branch: ", error);
    }
  };

  const handleEdit = (branchId) => {
    setEditingBranchId(branchId);
    const branchToEdit = branches.find((branch) => branch.id === branchId);
    setEditedName(branchToEdit.name);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/updatebranch/${editingBranchId}`,
        {
          name: editedName,
        }
      );
      if (response.data.success) {
        toast.success("Branch updated successfully");
        setEditingBranchId(null);
        fetchBranches(); // Fetch branches after updating
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update branch");
      console.error("Error updating branch: ", error);
    }
  };

  return (
    <BranchFormContainer>
      <Row className="mt-5 justify-content-center">
        <Col md={12} lg={6} className="mb-5">
          <Card>
            <Card.Body>
              <div className="p-3">
                <h5 className="text-center ">Add New Branches</h5>
                <AddBranchForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={6}>
          <Card>
            <Card.Body>
              <h5 className="text-center pt-3">Branches</h5>

              <CustomTable responsive hover>
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id}>
                      <td>
                        {editingBranchId === branch.id ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        ) : (
                          branch.name
                        )}
                      </td>
                      <td>
                        {editingBranchId === branch.id ? (
                          <Button variant="success" onClick={handleSave}>
                            Save
                          </Button>
                        ) : (
                          <Button variant="primary" onClick={() => handleEdit(branch.id)}>
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CustomTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </BranchFormContainer>
  );
};

const BranchFormContainer = styled.div``;

const CustomTable = styled(Table)`
  background-color: #ffa500;
  border-radius: 20px;
  cursor: pointer;
`;

export default BranchForm;
