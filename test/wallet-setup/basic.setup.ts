import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

// Anvil default mnemonic
const SEED_PHRASE =
  "test test test test test test test test test test test junk";
const PASSWORD = "Tester@1234";

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);
  await metamask.importWallet(SEED_PHRASE);
  // MetaMask 13.x shows a "Your wallet is ready!" screen after import.
  // Click through it so the cache is saved at the main wallet screen,
  // not mid-onboarding. Otherwise the notification page shows this screen
  // instead of the connection request during tests.
  await walletPage.getByRole("button", { name: "Open wallet" }).click();
});
