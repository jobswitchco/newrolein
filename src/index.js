import React from 'react';
import ReactDOM from 'react-dom'; // NOT 'react-dom/client'
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';
import App from './App.js';
import store from './store/store.js';
import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Use legacy hydrate for react-snap compatibility
ReactDOM.hydrate(
  <GoogleOAuthProvider clientId='455976777846-jve7vqhe2ujq5ofm8svqkbpj8mse8kf9.apps.googleusercontent.com'>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);

reportWebVitals();
