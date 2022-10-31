import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';
import { Box, Button, Typography, Paper, Card, CardContent, CardMedia } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import CircleIcon from '@mui/icons-material/Circle';
import RegisterForm from '../RegisterForm/RegisterForm';
import Fade from '@mui/material/Fade';

function LandingPage() {
  const [heading, setHeading] = useState('Benchwarmer');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Fade in={true}>
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", overflowX: 'hidden' }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 10
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: 'column',
          }}
        >
          <Paper elevation={8} sx={{mb: 2, padding: 2, width: '99vw'}}>
          <Typography variant="h3" sx={{mb: 0}}>
            {heading}
          </Typography>
          <Divider />
          <Typography color='secondary' variant="h6" gutterBottom sx={{fontSize: '16px'}}>
            EZ Softball Scoring and Team Management App
          </Typography>
          </Paper>
            <Button 
              variant='contained' 
              color="success"
              size='small'
              onClick={onLogin}
              sx={{ padding: 1, mb: 2}}
              fullWidth
            >
              Login/Sign Up
            </Button>

        <Paper elevation={8} sx={{padding: 1, width: '95%'}}>
          {/* <Typography variant="body1" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            id felis metus. Vestibulum et pulvinar tortor. Morbi pharetra lacus
            ut ex molestie blandit. Etiam et turpis sit amet risus mollis
            interdum. Suspendisse et justo vitae metus bibendum fringilla sed
            sed justo. Aliquam sollicitudin dapibus lectus, vitae consequat odio
            elementum eget. Praesent efficitur eros vitae nunc interdum, eu
            interdum justo facilisis. Sed pulvinar nulla ac dignissim efficitur.
            Quisque eget eros metus. Vestibulum bibendum fringilla nibh a
            luctus. Duis a sapien metus.
          </Typography> */}
              <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="400"
        image="https://images.unsplash.com/photo-1595453926401-9e478c1b6184?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
        alt="dug out bench"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Focus on the Game
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Benchwarmer is your solution to ditching the complicated, pen and paper book scoring system!
        </Typography>
      </CardContent>
    </Card>
          <List>
          <ListItem key={1} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CircleIcon fontSize="small" color='secondary' />
              </ListItemIcon>
              <ListItemText primary="Little to no experience needed!" />
            </ListItemButton>
          </ListItem>
          <ListItem key={2} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CircleIcon fontSize="small" color='secondary' />
              </ListItemIcon>
              <ListItemText primary="Perfect for recreational or casual leagues" />
            </ListItemButton>
          </ListItem>
          <ListItem key={3} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CircleIcon fontSize="small" color='secondary' />
              </ListItemIcon>
              <ListItemText primary="No more confusing paper scorebook!" />
            </ListItemButton>
          </ListItem>
          <ListItem key={4} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CircleIcon fontSize="small" color='secondary' />
              </ListItemIcon>
              <ListItemText primary="Designed for softball first" />
            </ListItemButton>
          </ListItem>
        </List>
        </Paper>
        </Box>
      </Box>
    </Box>
    </Fade>
  );
}

export default LandingPage;
