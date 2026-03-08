import ConnectGate from "@/components/connect-gate";
import { AirdropForm } from "@/components/forms/airdrop-form";
import Header from "@/components/header";

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <ConnectGate>
          <AirdropForm />
        </ConnectGate>
      </main>
    </div>
  );
}
