import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';
import App from './App.js';
import store from '../src/store/store.js';
import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// import { HelmetProvider } from 'react-helmet-async';


const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log('clientId from index file: ', clientId);



root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
  <Provider store={store}>
    <App />
  </Provider>
</GoogleOAuthProvider>,

  // </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
