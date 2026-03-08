# Local setup

This guide walks you through running the full TSender stack locally: frontend + smart contract + local blockchain.

---

## Prerequisites

Install these tools before starting:

- [Node.js](https://nodejs.org) v18+
- [Bun](https://bun.sh) — used as the package manager and runtime
- [Foundry](https://book.getfoundry.sh/getting-started/installation) — includes `forge`, `anvil`, `cast`

Verify your setup:

```bash
node --version
bun --version
forge --version
anvil --version
```

---

## 1. Clone the repository

```bash
git clone <repo-url>
cd tsender-ui
```

---

## 2. Install frontend dependencies

```bash
bun install
```

---

## 3. Install smart contract dependencies

Foundry dependencies are not committed to the repo. Install them with:

```bash
cd tsender
forge install
cd ..
```

This installs `forge-std` and `openzeppelin-contracts` into `tsender/lib/`.

---

## 4. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Then fill in the values:

| Variable                                | Description                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Your WalletConnect project ID — get one free at [cloud.walletconnect.com](https://cloud.walletconnect.com) |
| `NEXT_PUBLIC_TSENDER_CONTRACT_ADDRESS`  | The deployed AirdropContract address (filled after step 6)                                                 |

---

## 5. Start a local blockchain

In a separate terminal, start Anvil:

```bash
anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1
```

Or use the Makefile shortcut from the `tsender/` directory:

```bash
cd tsender && make anvil
```

Anvil starts on `http://127.0.0.1:8545` (chain ID `31337`) and prints 10 test accounts with private keys.

---

## 6. Deploy the contracts locally

In a new terminal, from the `tsender/` directory:

```bash
cd tsender
make deploy
```

This runs `forge script script/DeployAirdrop.s.sol` against the local Anvil node and deploys:

- An `ERC20Mock` token (for testing)
- The `AirdropContract`

The output will include the deployed addresses, for example:

```
ERC20Mock deployed at:     0x5FbDB2315678afecb367f032d93F642f64180aa3
AirdropContract deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

The `AirdropContract` address for chain `31337` is already set in `constants/index.ts`. If you redeploy and get a different address, update it there.

---

## 7. Mint test tokens

The deployer account receives the initial token supply. To fund a wallet for testing, use:

```bash
cd tsender
make mint-tokens RECIPIENT=<your-wallet-address>
```

This mints 1000 tokens to the given address using the default Anvil deployer key.

---

## 8. Run the tests

The frontend has a unit test suite using Vitest and React Testing Library.

Run all tests once:

```bash
bun test:run
```

Run in watch mode (reruns on file save):

```bash
bun test
```

Run a specific test file:

```bash
bun test:run utils/index.test.ts
```

**What is tested:**

- `utils/index.ts` — `parseRecipients` and `parseAmounts` pure functions
- `schemas/airdrop.schema.ts` — Zod validation rules
- `components/forms/airdrop-form.tsx` — form rendering and UI behavior

Blockchain interaction logic (contract calls, approvals) is not unit tested — that requires a forked chain and belongs in integration tests.

---

## 9. Run end-to-end tests

The project uses Playwright for e2e tests. These start a real browser and navigate your running app.

### First-time setup

Install the Playwright browser binary (Chromium only — MetaMask runs exclusively in Chromium):

```bash
bunx playwright install chromium
```

This is a one-time step per machine. The binary is stored in a local Playwright cache, not in `node_modules`.

### Running e2e tests

Run all e2e tests headlessly (CI mode):

```bash
bun test:e2e
```

Run with a visible browser window:

```bash
bun test:e2e:headed
```

Run in UI mode (interactive dashboard — recommended during development):

```bash
bun test:e2e:ui
```

UI mode shows a test panel, a live browser preview, action timeline, and screenshots at each step. It also lets you re-run individual tests by clicking them.

Run a specific spec file:

```bash
bun test:e2e:headed -- e2e/connect-gate.spec.ts
```

### Test files

E2e tests live in the `e2e/` directory:

| File                          | What it tests                                                                  | Requires wallet |
| ----------------------------- | ------------------------------------------------------------------------------ | --------------- |
| `e2e/connect-gate.spec.ts`    | Gate renders when wallet is not connected, header is visible, form is hidden   | No              |
| `e2e/airdrop.spec.mts`        | Wallet connects via MetaMask, gate clears, airdrop form becomes visible        | Yes (Synpress)  |

### Configuration

The Playwright config is at `playwright.config.ts`. Key settings:

| Option                | Value                         | Why                                                   |
| --------------------- | ----------------------------- | ----------------------------------------------------- |
| `testDir`             | `./e2e`                       | Where test files live                                 |
| `baseURL`             | `http://localhost:3000`       | Prepended to every `page.goto("/")`                   |
| `browserName`         | `chromium`                    | Only browser that supports MetaMask                   |
| `workers`             | `1`                           | Synpress tests cannot run in parallel (shared state)  |
| `tsconfig`            | `./tsconfig.e2e.json`         | NodeNext module resolution required for `.mts` specs  |
| `webServer.command`   | `bun dev`                     | Playwright starts the dev server automatically        |
| `reuseExistingServer` | `true` locally, `false` on CI | Reuses a running dev server locally for speed         |

### Wallet tests with Synpress

Tests in `e2e/airdrop.spec.mts` use [Synpress](https://docs.synpress.io) to automate MetaMask. Synpress loads a real MetaMask extension in a persistent Chromium context, unlocks it, and handles connection approvals.

#### Wallet setup files

The wallet setup lives in `test/wallet-setup/basic.setup.ts`. It defines the seed phrase and password used to import the test wallet. The setup file must end in `.setup.{ts,js,mjs}`.

#### Building the wallet cache

Before running wallet tests, build the MetaMask cache once:

```bash
bun wallet:cache
```

This launches a headed Chromium browser, runs the wallet setup (imports the Anvil mnemonic into MetaMask), and saves the browser profile to `.cache-synpress/`. The cache only needs to be rebuilt when `basic.setup.ts` changes.

> **Note:** `.cache-synpress/` is gitignored and machine-local.

To force a full rebuild:

```bash
rm -rf .cache-synpress && bun wallet:cache
```

#### Known issue — MetaMask cache

There is an active compatibility issue between **Synpress v4.1.2** and **MetaMask 13.13.1**. The `importWallet` step in the setup completes without error but does not persist the wallet vault, so when tests run MetaMask shows the initial "Create / Import" onboarding screen and `unlockForFixture` times out.

This is under investigation. Until resolved, `e2e/airdrop.spec.mts` will hang on the `context` fixture setup.

**Workaround:** run only the non-wallet tests:

```bash
bun test:e2e -- e2e/connect-gate.spec.ts
```

---

## 10. Run the frontend

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Connect your wallet using one of the Anvil test accounts and point it to:

- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency symbol:** `ETH`

---

## Troubleshooting

**Anvil state file errors** — if you have an old state file from a previous Anvil version, delete it and redeploy fresh. Anvil state file formats changed between versions.

**Wrong network** — make sure your wallet is connected to the local Anvil network, not mainnet or a testnet.

**`bigint` literal errors** — requires TypeScript target `ES2020` or higher. This is already set in `tsconfig.json`.

**Wallet shows NaN ETH** — double-check that `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set to a valid WalletConnect project ID, not a contract address.
