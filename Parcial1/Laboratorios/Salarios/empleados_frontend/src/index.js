import React from 'react';
import ReactDOM from 'react-dom/client';
// Bootstrap CSS (instalado via npm)
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap JS bundle (opcional - incluye Popper, necesario para componentes interactivos)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Custom app styles (can override Bootstrap variables/classes)
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
