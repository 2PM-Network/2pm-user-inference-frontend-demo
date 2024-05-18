import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { WagmiProvider  } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
<React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </WagmiProvider>
    
  </React.StrictMode>,
);
