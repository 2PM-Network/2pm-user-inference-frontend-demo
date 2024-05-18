import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { scrollSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
  ]
})