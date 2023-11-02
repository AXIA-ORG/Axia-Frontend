import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ApolloProvider } from "@apollo/client";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from "wagmi/chains";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../config/theme";
import Layout from "../components/app/Layout";
import apolloClient from "../apollo-client";
import "../styles/globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../config/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <DndProvider backend={HTML5Backend}>
        <ApolloProvider client={apolloClient}>
          <RainbowKitProvider chains={chains}>
            <ChakraProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </I18nextProvider>
              </QueryClientProvider>
            </ChakraProvider>
          </RainbowKitProvider>
        </ApolloProvider>
      </DndProvider>
    </WagmiConfig>
  );
}

export default MyApp;
