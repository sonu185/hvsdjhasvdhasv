import { useEffect, useState } from 'react'
import React from 'react'
import Plot from 'react-plotly.js'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const InvestorStartupSales = () => {
  const [filteredsData, setFilteredSalesData] = useState([]);
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  

  const location = useLocation();
  const { startupName, investorName} = location.state;
  const [permission, setPermission] = useState();
 


 
  const fetchDataofsale = () => {
    setLoading(true);
  
    fetch('https://fundrevassigment.onrender.com/startup/' + startupName,)
      .then((response) => response.json())
      .then((data) => {
        const salesDataArray = Object.entries(data.startup.salesData).map(([year, salesObj]) => ({
          year: parseInt(year) + 2019,
          sales: salesObj.sales,
        }));
        setSalesData(salesDataArray);
        setFilteredSalesData(salesDataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
    };
   const filteredSalesData = salesData.filter((item) => {
    const year = item.year;
    return (year >= parseInt(startDate) && year <= parseInt(endDate));
    });
  const handleFilter = () => {
    const filteredData = salesData.filter(item => {
      const year = item.year;
      return (year >= parseInt(startDate) && year <= parseInt(endDate));
    });
    filteredsData(filteredData);
  };
  const havingpermissin = () => {
    setLoading(true);
  
    fetch('https://fundrevassigment.onrender.com/incomingRequests/' + startupName)
      .then((response) => response.json())
      .then((data) => {
        const matchingRequests = data.requests.filter(
          (request) => request.status === 'accepted' && request.investorName === investorName
        );
        if (matchingRequests.length > 0) {
          setPermission(true);
        } else {
          setPermission(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });
  };
  const handleLogout = () => {
    // Clear user data, tokens, etc. from storage
    localStorage.clear();

    // Redirect to login page
    navigate('/login');
  };
  useEffect(()=>{
    havingpermissin();
    fetchDataofsale();
  },[])  
  return (
    <div className='Dashboard '>
      {permission === true?
      
      <div>
        <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
        <p className='sentence'>Hi👋 {investorName}😊</p>
        <p className='sentence'>😎Behold the sales data at your fingertips {startupName}⏳</p>
        
        <div>
          <label>🕖Start Year:</label>
          <input type="number" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>🕖End Year:</label>
          <input type="number" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Plot
        className='sales-plot'
        data={filteredSalesData.map(({ year, sales }) => ({
            type: 'bar',
            x: months, 
            y: sales,
            name: year.toString(),
        }))}
        layout={{
            title: '📈monthly sales figures',
            xaxis: { title: '🕤Month' },
            yaxis: { title: '💰Sales at particular Month' },
        }}
        />
      </div>
      
      :<p>You do not have permission to view this webpage.</p>}
    </div>
  )
}

export default InvestorStartupSales
