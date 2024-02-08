import React, { useState, useEffect } from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';
import './css/dashboard.css';
import "./css/login.css"
const StartupDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const { CompanyName, businessDescription, revenue } = location.state;

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target.result;

        try {
          const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true });
          const salesByMonth = groupSalesByMonth(parsedData.data);
          setSalesData(Object.values(salesByMonth));
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const groupSalesByMonth = (data) => {
    const salesByYear = {};
  
    data.forEach((row) => {
      const date = new Date(row['Order Date']);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${month}-${year}`;
  
      if (!salesByYear[year]) {
        salesByYear[year] = Array(12).fill(0); 
      }
  
      salesByYear[year][month - 1] += row['Sales'];
    });
    const salesByYearArray = Object.entries(salesByYear).map(([year, sales]) => ({
      year: parseInt(year),
      sales,
    }));
  
    return salesByYearArray;
  };
  
  const filteredSalesData = salesData.filter((item) => {
    const year = item.year;
    return (startDate === '' || year >= parseInt(startDate)) &&
           (endDate === '' || year <= parseInt(endDate));
  });
  const handleLogout = () => {
    // Clear user data, tokens, etc. from storage
    localStorage.clear();

    // Redirect to login page
    navigate('/login');
  };
  const handleUpdateSales = () => {
    fetch('https://fundrevassigment.onrender.com/updateSales/' + CompanyName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Sales data updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating sales data:', error);
      });
  };

  const fetchSalesData = () => {
    setLoading(true);

    fetch('https://fundrevassigment.onrender.com/startup/' + CompanyName)
      .then((response) => response.json())
      .then((data) => {
        const salesDataArray = Object.entries(data.startup.salesData).map(([year, salesObj]) => ({
          year: parseInt(year) + 2019,
          sales: salesObj.sales,
        }));
        
        setSalesData(salesDataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
  };

  const fetchPendingRequests = () => {
    setLoading(true);
    
    fetch(`https://fundrevassigment.onrender.com/incomingRequests/${CompanyName}`)
      .then((response) => response.json())
      .then((data) => {
        const pendingRequests = data.requests.filter((request) => request.status === 'pending');
        setIncomingRequests(pendingRequests);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pending requests:', error);
        setLoading(false);
      });
  };
  
  const handleChangeRequestStatus = (requestId, status) => {
    fetch('https://fundrevassigment.onrender.com/changeRequestStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        status,
      }),
    })
      .then((response) => response.json())
      .then((updatedRequest) => {
        console.log(`Request ${status}:`, updatedRequest);
        window.location.reload();
      })
      .catch((error) => {
        console.error(`Error ${status}ing request:`, error);
      });
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <section className='Dashboard styledashbord'>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      
      <div className='plotAndRequests'>
        <div className='startup-plot'>
        <input
            id='startDate'
            type='number'
            placeholder='Start Year'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            id='endDate'
            type='number'
            placeholder='End Year'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
           <div className='update'>
          
          <input
            id='avatar'
            type='file'
            name='avatar'
            accept='.csv'
            onChange={handleFileUpload}
          />
          <Button className="update-btn" onClick={handleUpdateSales}>Update Sales</Button>
        </div>
          <Plot
            className='plot1'
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
              autosize: true, 
            }}
          />
          {/* Other Plots */}
        </div>
        <div><h1 className='username'>🏢{CompanyName}</h1>
      <h1 className='sentence'>💰Revenue-{revenue}</h1></div>
      
      </div>

      <div className='PendingRequests'>
        <p className='pending-requests-txt'>Request from Invester</p>
        {incomingRequests.map((request)=>(
          <Box className="company-card" sx={{ width: 380, marginBottom: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div" className='card-investor-name'>
                  {request.investorName}
                </Typography>
              </CardContent>
              <div className='approveRequests'>
                <CardActions>
                  <Button 
                    size="small" 
                    className='approve-request'
                    onClick={() => handleChangeRequestStatus(request._id, 'accepted')}>
                    <img className='request-symbol' src={require('../Assests/images/approve.png')}/>&nbsp; Approve Request</Button>
                </CardActions>
                <CardActions>
                  <Button 
                    size="small" 
                    className='decline-request'
                    onClick={() => handleChangeRequestStatus(request._id, 'rejected')}>
                    <img className='request-symbol' src={require('../Assests/images/decline.png')}/>&nbsp; Decline Request</Button>
                </CardActions>
              </div>
            </Card>
          </Box>
        ))}
      </div>
    </section>
  );
};

export default StartupDashboard;
