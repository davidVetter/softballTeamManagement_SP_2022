import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';


function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <AppBar position='static' color="secondary">
      <Link to="/home">
        <Typography variant='h3' className="nav-title">Benchwarmer</Typography>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/user">
              Home
            </Link>

            <Link className="navLink" to="/team">
              Team Page
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </div>
    </AppBar>
  );
}

export default Nav;
