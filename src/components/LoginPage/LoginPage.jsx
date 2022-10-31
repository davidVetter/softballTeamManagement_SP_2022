import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import Slide from '@mui/material/Slide';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <LoginForm />
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
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
      </Slide>
    </div>
  );
}

export default LoginPage;
