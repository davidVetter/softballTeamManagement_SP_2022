import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, FormLabel, TextField, Button, Paper, Box, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import stateLabelValues from '../../data/registerData/statesList';

function EditUserForm(props) {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [jerseySize, setJerseySize] = useState('');
    const [hatSize, setHatSize] = useState('');
    const [bats, setBats] = useState('');
    const [throws, setThrows] = useState('');
    // const [editMode, setEditMode] = useState(false);
    const user = useSelector((store) => store.user);
  
    const errors = useSelector((store) => store.errors);
    const dispatch = useDispatch();

    useEffect(() => {
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhoneNumber(user.phone_number);
        setStreetAddress(user.street_address);
        setCity(user.city);
        setState(user.state);
        setZip(user.zip);
        setJerseySize(user.jersey_size);
        setHatSize(user.hat_size);
        setBats(user.bats);
        setThrows(user.throws);
    }, [])

    // This function will clear all the local states
    const clearLocalState = () => {
        setUsername('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setStreetAddress('');
        setCity('');
        setState('');
        setZip('');
        setJerseySize('');
        setHatSize('');
        setBats('');
        setThrows('');
    }

    // Sends the user entered data to sagas
    const updateUser = (event) => {
      event.preventDefault();
      let cleanNumber = 0;
      // Removes common extra characters from the entered phone number
      // if they exist
      if (phoneNumber.indexOf('-') >= 0) {
        cleanNumber = phoneNumber.replaceAll('-', '');
      } else if (phoneNumber.indexOf('.') >= 0) {
        cleanNumber = phoneNumber.replaceAll('.', '');
      } else if (phoneNumber.indexOf('(') >= 0) {
        cleanNumber = phoneNumber.replaceAll('(', '');
      } else if (phoneNumber.indexOf(')') >= 0) {
        cleanNumber = phoneNumber.replaceAll(')', '');
      }  else {
        cleanNumber = phoneNumber;
      }
      // Send data to saga for POST to server
      dispatch({
        type: 'EDIT_USER',
        payload: {
          username,
          firstName,
          lastName,
          phoneNumber: cleanNumber,
          streetAddress,
          city,
          state,
          zip,
          jerseySize,
          hatSize,
          bats,
          throws
        },
      });
      clearLocalState();
      props.setEditMode(false);
    }; // end registerUser
  
    return (
      <Box sx={{width:'100%', display: 'flex', alignItems:'center', justifyContent:'center'}}>
      {/* <Button variant='outlined' type="button" onClick={() => {
        clearLocalState();
        props.setEditMode(false)}}>Cancel</Button> */}
      <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
      <form onSubmit={updateUser}>
        <Grid container alignItems='center' justify='center' direction='column'>
        <Typography variant='h4' gutterBottom>Edit User</Typography>
        {errors.registrationMessage && (
          <Typography variant='h6' className="alert" role="alert">
            {errors.registrationMessage}
          </Typography>
        )}
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="username">
            <TextField
              variant='outlined'
              label='Email'
              size='normal'
              type="text"
              name="username"
              filled='true'
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="first-name">
            <TextField
              variant='outlined'
              label='First Name'
              size='normal'
              filled='true'
              type="text"
              name="firstName"
              value={firstName}
              required
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="last-name">
            <TextField
              variant='outlined'
              label='Last Name'
              size='normal'
              filled='true'
              type="text"
              name="lastName"
              value={lastName}
              required
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="phone-number">
            <TextField
              variant='outlined'
              label='Phone #'
              size='normal'
              filled='true'
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="street-address">
            <TextField
              variant='outlined'
              label='Street Address'
              size='normal'
              filled='true'
              type="text"
              name="streetAddress"
              value={streetAddress}
              required
              onChange={(event) => setStreetAddress(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="city">
            <TextField
              variant='outlined'
              label='City'
              size='normal'
              filled='true'
              type="text"
              name="city"
              value={city}
              required
              onChange={(event) => setCity(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1, minWidth: '80px'}}>
          <FormControl fullWidth>
          <InputLabel htmlFor="state">State</InputLabel>
            <Select
              value={state}
              label='State'
              required
              size='normal'
              onChange={(event) => {
                setState(event.target.value)
              }}
            >
              {stateLabelValues.map(state => {
               return <MenuItem key={state.value} value={state.value}>{state.label}</MenuItem>
              })}
            </Select>
            </FormControl>
        </Grid>
        <Grid item sx={{mb: 1}}>
          <FormLabel htmlFor="zip">
            <TextField
              variant='outlined'
              label='Zip Code'
              size='normal'
              filled='true'
              type="number"
              name="zip"
              value={zip}
              required
              onChange={(event) => setZip(event.target.value)}
            />
          </FormLabel>
        </Grid>
        <Grid item sx={{mb: 1, minWidth: '150px'}}>
          <FormControl fullWidth>
          <InputLabel htmlFor="jersey-size">Jersey Size</InputLabel>
            <Select
              value={jerseySize}
              label='jerseySize'
              required
              size='normal'
              onChange={(event) => {
                setJerseySize(event.target.value)
              }}
            >
              <MenuItem key='m' value='m'>Medium</MenuItem>
              <MenuItem key='l' value='l'>Large</MenuItem>
              <MenuItem key='xl' value='xl'>X-Large</MenuItem>
              <MenuItem key='xxl' value='xxl'>XX-Large</MenuItem>
              <MenuItem key='xxxl' value='xxxl'>XXX-Large</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        <Grid item sx={{mb: 1, minWidth: '150px'}}>
          <FormControl fullWidth>
          <InputLabel htmlFor="jersey-size">Hat Size</InputLabel>
            <Select
              value={hatSize}
              label='hatSize'
              required
              size='normal'
              onChange={(event) => {
                setHatSize(event.target.value)
              }}
            >
              <MenuItem key='m' value='m'>Medium</MenuItem>
              <MenuItem key='l' value='l'>Large</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        <Grid item sx={{mb: 1, minWidth: '150px'}}>
          <FormControl fullWidth>
          <InputLabel htmlFor="bats">Bats?</InputLabel>
            <Select
              value={bats}
              label='bats'
              required
              size='normal'
              onChange={(event) => {
                setBats(event.target.value)
              }}
            >
              <MenuItem key='r' value='r'>Right Handed</MenuItem>
              <MenuItem key='l' value='l'>Left Handed</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        <Grid item sx={{mb: 1, minWidth: '150px'}}>
          <FormControl fullWidth>
          <InputLabel htmlFor="throws">Throws?</InputLabel>
            <Select
              value={throws}
              label='throws'
              required
              size='normal'
              onChange={(event) => {
                setThrows(event.target.value)
              }}
            >
              <MenuItem key='r' value='r'>Right handed</MenuItem>
              <MenuItem key='l' value='l'>Left handed</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        <Grid item sx={{mb: 2}}>
          <Button variant='contained' type="submit" name="submit" value="Register">Update</Button>
          <Button variant='outlined' type="button" onClick={() => {
        clearLocalState();
        props.setEditMode(false)}}>Cancel</Button>
        </Grid>
        </Grid>
      </form>
      </Paper>
      </Box>
    );
  }
  
  export default EditUserForm;