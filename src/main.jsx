import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import store from "./store/store";
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "quill/dist/quill.snow.css";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <StrictMode>
    <App />
  </StrictMode>,
    </BrowserRouter>
  </Provider>
)
