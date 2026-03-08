"use client";
import { useConnection } from "wagmi";
import { Wallet2Icon } from "lucide-react";

export default function ConnectGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useConnection();

  if (isConnected) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-6 text-center px-4">
      <div className="p-5 rounded-full bg-primary/10 border border-primary/20">
        <Wallet2Icon className="w-12 h-12 text-primary" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-chart-4 bg-clip-text text-transparent">
          Connect your wallet
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Use the{" "}
          <span className="font-medium text-foreground">Connect Wallet</span>{" "}
          button at the top to get started.
        </p>
      </div>
    </div>
  );
}
