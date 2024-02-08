import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./css/login.css"
const InvestorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state;
  const handleLogout = () => {
    // Clear user data, tokens, etc. from storage
    localStorage.clear();

    // Redirect to login page
    Navigate('/login');
  };
  const fetchCompanies = () => {
    setLoading(true);

    fetch('https://fundrevassigment.onrender.com/allCompanies')
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data.companies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
        setLoading(false);
      });
  };
  const showInterest = (startupName) =>{
    fetch('https://fundrevassigment.onrender.com/submitInterest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        investorName: username, 
        startupName
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Interest request submitted successfully:', data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error submitting interest request:', error);
      });
  }
  const fetchPendingRequests = () => {
    setLoading(true);

    fetch(`https://fundrevassigment.onrender.com/requests/` + username)
      .then((response) => response.json())
      .then((data) => {
        setIncomingRequests(data.requests);
        console.log(data.requests)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pending requests:', error);
        setLoading(false);
      });
  };
  const renderInterestButton = (startup) => {
    const request = incomingRequests.find((req) => req.startupName === startup.username);
    
    if (request) {
      if (request.status === 'pending') {
        return <Button size="small" disabled>Pending</Button>;
      } else if (request.status === 'accepted') {
        return <div>
                  <Button size="small" color='success'>Accepted</Button>
                  <Button onClick={()=>Navigate("/investorStartupSales",{state:{
                        startupName:startup.username,
                        investorName:username,
                    }})}>Check Sales</Button>
               </div>
      } else if (request.status === 'rejected') {
        return <Button size="small" color='error'>Rejected</Button>;
      }
    }

    return <Button size="small" onClick={() => showInterest(startup.username)}>Show Interest</Button>;
  };
  useEffect(() => {
    fetchCompanies();
    fetchPendingRequests();
  }, []);

  return (
    <section className='Dashboard styledashbord'>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <h3 className='username'>Hi👋 {username} 😊</h3>
      <p className='sentence'>Explore these captivating startups that might pique your interest:</p>
      <div class="companies">
      {companies.map((company) => (
        <Box className="company-card" key={company._id} sx={{ width: 330, marginBottom: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {company.username}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {company.businessDescription}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Revenue: {company.revenue}
              </Typography>
            </CardContent>
            <CardActions>
              {renderInterestButton(company)}
            </CardActions>
            
          </Card>
        </Box>
      ))}
      </div>
      
    </section>
  );
};

export default InvestorDashboard;
