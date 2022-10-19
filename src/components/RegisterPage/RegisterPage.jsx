import React from 'react';
import { Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  const history = useHistory();

  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <RegisterForm />
        <Button
          type="button"
          className="btn btn_asLink"
          variant='text'
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
    </Box>
  );
}

export default RegisterPage;
