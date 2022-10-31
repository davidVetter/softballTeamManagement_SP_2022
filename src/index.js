import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from "@mui/material/styles";


import store from './redux/store';

import App from './components/App/App';

const theme = createTheme({
  palette: {
    // primary: {
    //   main: "#1DD3B0"
    // },
    // secondary: {
    //   main: "#affc41"
    // },
    // warning: {
    //   main: "#FFFF00"
    // },
    // success: {
    //   main: "#b2ff9e"
    // },
    primary: {
      main: "#abff4f"
    },
    secondary: {
      main: "#2e86ab"
    },
    warning: {
      main: "#f0a202"
    },
    error: {
      main: '#f8333c'
    },
    success: {
      main: "#38a700"
    },
    info: {
      main: "#7d8ca3"
    },
    mode: 'dark'
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('react-root'),
);
