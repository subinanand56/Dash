import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

const PurchaseTable = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [purchaseData, setPurchaseData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getAllBranches = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/branch/get-branch`);
      if (response.data?.success) {
        setBranches(response.data.branch);
      } else {
        toast.error(response.data?.message || 'Something went wrong in getting branches');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network Error: Unable to connect to the API server');
    }
  };

  const getAllPurchases = async (branchId = 'all') => {
    try {
      let endpoint = `${process.env.REACT_APP_API}/api/v1/purchaserqst/admin-purchase-requests`;

      if (branchId !== 'all') {
        endpoint = `${process.env.REACT_APP_API}/api/v1/purchaserqst/admin-purchase-requests/${branchId}`;
      }

      const response = await axios.get(endpoint);
      setPurchaseData(response.data.purchaseRequests);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to fetch purchases. Please try again.');
    }
  };

  const handleDateRangeSelect = async () => {
    try {
      let endpoint = `${process.env.REACT_APP_API}/api/v1/purchaserqst/admin-purchase-requests`;

      if (selectedBranch !== 'all') {
        endpoint = `${process.env.REACT_APP_API}/api/v1/purchaserqst/admin-purchase-requests/${selectedBranch}`;
      }

      const response = await axios.get(endpoint);

      const filteredPurchases = response.data.purchaseRequests.filter((purchase) => {
        const purchaseDate = new Date(purchase.updatedAt).getTime();
        const fromDateTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
        let toDateTimestamp = toDate ? new Date(toDate).getTime() : Number.MAX_SAFE_INTEGER;
        toDateTimestamp = new Date(toDateTimestamp + 24 * 60 * 60 * 1000).getTime();

        return purchaseDate >= fromDateTimestamp && purchaseDate <= toDateTimestamp;
      });

      setPurchaseData(filteredPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to fetch purchases. Please try again.');
    }
  };

  useEffect(() => {
    getAllBranches();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setFromDate(oneMonthAgo.toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    getAllPurchases();
  }, []);

  useEffect(() => {
    getAllPurchases(selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    handleDateRangeSelect();
  }, [fromDate, toDate]);

  const generateAndDownloadInvoice = () => {
    const headers = ['Branch', 'Product Name', 'Company Name', 'Price'];
    const csvContent = [
      headers.join(','),
      ...purchaseData.map((purchase) => {
        const branchName =
          selectedBranch === 'all'
            ? purchase.branch.name
            : branches.find((branch) => branch._id === selectedBranch)?.name || '';
        return [branchName, purchase.productName, purchase.companyName, purchase.price].join(',');
      }),
    ].join('\n');

    const totalPurchaseAmount = purchaseData.reduce((total, purchase) => total + purchase.price, 0);

    const csvWithTotal = `${csvContent}\nTotal Purchase Amount,${totalPurchaseAmount}`;

    const blob = new Blob([csvWithTotal], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'purchase_invoice.csv');
  };
const totalPurchaseAmount = purchaseData.reduce((total, purchase) => total + purchase.price, 0);
 
  return (
    <div>
      <h1>Purchases</h1>
      <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
        <option value="all">All</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name}
          </option>
        ))}
      </select>
      <label>
        From:
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </label>
      <label>
        To:
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </label>

   
        <Button className='m-1' variant="primary" onClick={generateAndDownloadInvoice}>
          Download
        </Button>
  

      <div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Product Name</th>
              <th>Company Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((purchase) => {
              const branchName =
                selectedBranch === 'all'
                  ? purchase.branch.name
                  : branches.find((branch) => branch._id === selectedBranch)?.name || '';

              return (
                <tr key={purchase._id}>
                  <td>{branchName}</td>
                  <td>{purchase.productName}</td>
                  <td>{purchase.companyName}</td>
                  <td>{purchase.price}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="3"><strong>Total Purchase Amount:</strong></td>
              <td>{totalPurchaseAmount}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaseTable;
