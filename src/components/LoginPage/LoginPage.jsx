import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <LoginForm />

      <center>
        <Button
          type="button"
          variant='contained'
          className="btn btn_asLink"
          color='success'
          onClick={() => {
            history.push('/registration');
          }}
        >
          Sign Up?
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;
