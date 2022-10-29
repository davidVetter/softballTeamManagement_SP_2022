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
