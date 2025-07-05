import { createRoot, hydrateRoot } from 'react-dom/client'; // ✅ use correct import
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';
import App from './App.js';
import store from './store/store.js';
import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';

// Target the root element
const rootElement = document.getElementById('root');

// Wrap the app in GoogleOAuth and Redux Provider
const AppTree = (
    <Provider store={store}>
      <App />
    </Provider>
);

// 🔁 Use hydrateRoot for SSR (used by react-snap), else fallback to createRoot
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, AppTree);
} else {
  createRoot(rootElement).render(AppTree);
}

// Optional: Performance metrics
reportWebVitals();
