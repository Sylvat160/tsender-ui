"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  anvil,
  zksync,
  sepolia,
} from "wagmi/chains";
import { env } from "@/lib/env";

export default getDefaultConfig({
  appName: "TSender",
  projectId: env.NEXT_PUBLIC_TSENDER_CONTRACT_ADDRESS,
  chains: [mainnet, optimism, arbitrum, base, zksync, sepolia, anvil],
  ssr: false,
});
