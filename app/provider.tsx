"use client";
import { env } from "@/lib/env";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, anvil, zksync } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { getRainbowTheme } from "@/lib/rainbow-theme";

const config = getDefaultConfig({
  appName: "Tsender",
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [mainnet, sepolia, anvil, zksync],
  ssr: false,
});

const queryClient = new QueryClient();

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={getRainbowTheme(resolvedTheme === "dark" ? "dark" : "light")}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
