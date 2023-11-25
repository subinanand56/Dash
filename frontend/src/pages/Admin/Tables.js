import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';

const Tables = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [salesData, setSalesData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getAllBranches = async () => {
    try {
      const response = await axios.get(`https://web-final-etmp.onrender.com/api/v1/branch/get-branch`);
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

  useEffect(() => {
    getAllBranches();
    handleBranchSelect(selectedBranch);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setFromDate(oneMonthAgo.toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
  }, [selectedBranch]);

  useEffect(() => {
    handleDateRangeSelect();
  }, [fromDate, toDate]);

  const handleBranchSelect = async (branchId) => {
    try {
      let salesEndpoint = `https://web-final-etmp.onrender.com/api/v1/sales/all-sale`;

      if (branchId !== 'all') {
        salesEndpoint = `https://web-final-etmp.onrender.com/api/v1/sales/all-sale/${branchId}`;
      }

      const response = await axios.get(salesEndpoint);
      setSalesData(response.data.sales);
      setSelectedBranch(branchId);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleDateRangeSelect = async () => {
    try {
      let salesEndpoint = `https://web-final-etmp.onrender.com/api/v1/sales/all-sale`;

      if (selectedBranch !== 'all') {
        salesEndpoint = `https://web-final-etmp.onrender.com/api/v1/sales/all-sale/${selectedBranch}`;
      }

      const response = await axios.get(salesEndpoint);

      const filteredSales = response.data.sales.filter((sale) => {
        const saleDate = new Date(sale.saleDateTime).getTime();
        const fromDateTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
        let toDateTimestamp = toDate ? new Date(toDate).getTime() : Number.MAX_SAFE_INTEGER;

        // Increase toDateTimestamp by one day to make it inclusive of the entire toDate
        toDateTimestamp = new Date(toDateTimestamp + 24 * 60 * 60 * 1000).getTime();

        // Include sales for fromDate and toDate within the range (inclusive)
        return saleDate >= fromDateTimestamp && saleDate <= toDateTimestamp;
      });

      setSalesData(filteredSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      // Handle error, e.g., show a toast message
    }
  };

  const generateAndDownloadInvoice = () => {
    const headers = [
      `Selected Date Range: ${fromDate} to ${toDate}`, // Include selected date range as a header
      'Branch Name',
      'Product Name',
      'Amount',
      'Quantity',
      'Quantity Unit',
    ];
    const csvContent = [
      headers.join(','), // header row
      ...salesData.map((sale) => {
        const branchName =
          selectedBranch === 'all'
            ? sale.branch.name
            : branches.find((branch) => branch._id === selectedBranch)?.name || '';
        const productName = sale.name && sale.name.name;
  
        return [branchName, productName, sale.amount, sale.quantity, sale.quantityUnit].join(',');
      }),
    ].join('\n');
  
    const totalAmount = salesData.reduce((total, sale) => total + sale.amount, 0);
    const csvWithTotal = `${csvContent}\nTotal Amount,${totalAmount}`;
  
    const blob = new Blob([csvWithTotal], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sales_invoice.csv');
  };
  

  return (
    <TableContainer>
      <div>
        <h1>Sales</h1>
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
        <Button variant="primary" onClick={generateAndDownloadInvoice} className='m-1'>Download</Button>
      </div>
      <div>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Quantity</th>
              <th>QuantityUnit</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => {
              const branchName =
                selectedBranch === 'all'
                  ? sale.branch.name
                  : branches.find((branch) => branch._id === selectedBranch)?.name || '';
              const productName = sale.name && sale.name.name;

              return (
                <tr key={sale._id}>
                  <td>{branchName}</td>
                  <td>{productName}</td>
                  <td>{sale.amount}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.quantityUnit}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="2"><strong>Total Amount:</strong></td>
              <td colSpan="3">{salesData.reduce((total, sale) => total + sale.amount, 0)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  /* Add your styling for the table container */
`;

export default Tables;
