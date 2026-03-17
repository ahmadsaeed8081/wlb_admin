// import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {config} from "./components/configs/web3.config.tsx"


const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
//   <React.StrictMode>
    // <BrowserRouter>
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </WagmiProvider>    
    //</BrowserRouter> 
 
//   </React.StrictMode>
);
// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//     <WagmiProvider config={config}>
//     <QueryClientProvider client={queryClient}>
//     <App />
//     </QueryClientProvider>
//     </WagmiProvider>    
//     </BrowserRouter>
 
//   </React.StrictMode>
// );