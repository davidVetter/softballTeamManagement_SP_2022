import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import { Button, Grid, Typography, TextField, Box, Paper, FormLabel} from '@mui/material';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Paper elevation={8} sx={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb:1, mt: 3 }}>
    <form onSubmit={login}>
    <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4'>Login</Typography>
      {errors.loginMessage && (
        <Typography variant='h4' className="alert" role="alert">
          {errors.loginMessage}
        </Typography>
      )}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='Email'
            size='normal'
            filled='true'
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="password">
          <TextField
            type="password"
            name="password"
            variant='outlined'
            label='Password'
            size='normal'
            filled='true'
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{ mb: 1 }}>
        <Button variant='contained' type="submit" name="submit" value="Log In">Log In</Button>
      </Grid>
      </Grid>
    </form>
      </Paper>
      </Box>
  );
}

export default LoginForm;
