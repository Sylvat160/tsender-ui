import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "../test/wallet-setup/basic.setup.js";

const base = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = base;

// Synpress creates a persistent context without baseURL, so its internal
// page fixture calls goto("/") which fails. Override it to use the full URL.
const test = base.extend({
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto("http://localhost:3000");
    await use(page);
  },
});

test("shows airdrop form after connecting wallet", async ({
  context,
  page,
  metamaskPage,
  extensionId,
}) => {
  const metamask = new MetaMask(
    context,
    metamaskPage,
    "Tester@1234",
    extensionId,
  );

  await expect(page.getByText("Connect your wallet")).toBeVisible();

  await page.getByRole("button", { name: /connect wallet/i }).click();

  await page.getByText("MetaMask").click();
  await metamask.connectToDapp();

  await expect(page.getByText("Token Address")).toBeVisible();
});
