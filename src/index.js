import { hydrate, render } from 'react-dom';
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';
import App from './App.js';
import store from './store/store.js';
import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Target the root element
const rootElement = document.getElementById('root');

// Wrap the app in GoogleOAuth and Redux Provider
const AppTree = (
  <GoogleOAuthProvider clientId='455976777846-jve7vqhe2ujq5ofm8svqkbpj8mse8kf9.apps.googleusercontent.com'>

    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);

// Support react-snap hydration
if (rootElement.hasChildNodes()) {
  hydrate(AppTree, rootElement);
} else {
  render(AppTree, rootElement);
}

// Optional: Performance metrics
reportWebVitals();

