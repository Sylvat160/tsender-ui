"use client";
import "@rainbow-me/rainbowkit/styles.css";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToggleMode } from "./toggle-mode";

const Header = () => {
  return (
    <nav className="px-8 py-4.5 border-b border-primary flex flex-row justify-between items-center bg-foreground xl:min-h-19.25">
      <div className="flex items-centers gap-2.5 md:gap-6">
        <Link href="/" className="flex items-center gap-1 text-primary">
          <Image src="/T-Sender.svg" alt="TSender" width={36} height={36} />
          <h1 className="font-bold text-2xl hidden md:block">TSender</h1>
        </Link>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border-2 border-zinc-600 hover:border-zinc-500 cursor-alias hidden md:block"
        >
          <FaGithub className="h-5 w-5 text-white" />
        </a>
      </div>
      <h3 className="italic text-left hidden text-zinc-500 lg:block">
        The most gas efficient airdrop contract on earth, built in solidity 🐎
      </h3>
      <div className="flex items-center gap-2.5 md:gap-6">
        <ConnectButton />
        <div className="bg-secondary rounded-full">
          <ToggleMode />
        </div>
      </div>
    </nav>
  );
};

export default Header;
