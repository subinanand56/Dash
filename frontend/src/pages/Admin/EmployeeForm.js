import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Card, Table } from "react-bootstrap";
import styled from "styled-components";



const EmployeeForm = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);

  const mapBranchIdToName = (branchId, branches) => {
    const branch = branches.find(branch => branch._id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

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

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `https://web-final-etmp.onrender.com/api/v1/auth/get-users`
      );
      if (response.data?.success) {
        setUsers(response.data.user);
        console.log(response.data.user);
      } else {
        toast.error(
          response.data?.message || "Something went wrong in getting users"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error: Unable to connect to the API server");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `https://web-final-etmp.onrender.com/api/v1/auth/delete-user/${userId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Fetch the updated list of users after deletion
        getAllUsers();
      } else {
        toast.error(
          response.data?.message || "Failed to delete user. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    getAllBranches();
    getAllUsers();
  }, []);
  return (
    <EmployeeFormContainer>
      <div className="mt-5 justify-content-center">
        <h1 className="text-center">Employee List</h1>
        <div>
          {Array.isArray(users) && users.length > 0 ? (
            <Card>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>{mapBranchIdToName(user.branch, branches)}</td>
                      <td>{user.address}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          ) : (
            <p>No employees found.</p>
          )}
        </div>
      </div>
    </EmployeeFormContainer>
  );
};

const EmployeeFormContainer = styled.div`

`
export default EmployeeForm;
