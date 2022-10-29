import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
// import './Nav.css';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import Box from '@mui/material/Box';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <AppBar position='sticky' color="primary" sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Link to="/home">
        <Typography variant='h4' color='primary'>Benchwarmer</Typography>
      </Link>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link to="/login">
            <LoginIcon color='primary' />
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link to="/user">
              <HomeIcon color='primary' sx={{ mr: '2px' }}/>
            </Link>

            <Link to="/team">
              <GroupsIcon color='primary' sx={{ mr: '2px' }}/>
            </Link>

            <LogOutButton />
          </>
        )}

        <Link to="/about">
          <InfoIcon  color='primary' sx={{ mr: '2px' }}/>
        </Link>
        </Box>
        </Box>
    </AppBar>
  );
}

export default Nav;
