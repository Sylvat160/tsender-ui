# Architecture

TSender is split into two parts that work together: a **frontend UI** and a **smart contract**.

---

## Overview

```
User (browser)
    │
    │  connects wallet (RainbowKit)
    │  reads form input
    │
    ▼
Next.js Frontend (tsender-ui/)
    │
    │  calls approve() on ERC20 token contract
    │  calls airdropERC20() on TSender contract
    │
    ▼
EVM Network (Anvil locally / any EVM chain in production)
    │
    ├── ERC20 Token Contract  (external, user-provided address)
    └── AirdropContract       (tsender/src/AirdropContract.sol)
```

---

## Frontend (`tsender-ui/`)

The frontend is a Next.js application using the App Router.

**Key responsibilities:**
- Let the user connect their wallet via RainbowKit
- Collect inputs: token address, recipients list, amounts list
- Validate inputs client-side with Zod before sending any transaction
- Call `approve` on the ERC20 contract so TSender can spend tokens
- Call `airdropERC20` on the TSender contract
- Detect which network the user is on and use the correct contract address

**Key files:**
- `constants/index.ts` — contract addresses per chain, ABIs
- `hooks/use-airdrop-form.ts` — form state and Web3 interaction logic
- `components/forms/airdrop-form.tsx` — the main UI form
- `schemas/airdrop.schema.ts` — Zod schema for input validation

---

## Smart contract (`tsender/`)

A minimal Foundry project containing the `AirdropContract` Solidity contract.

**Key responsibilities:**
- Receive a token address, a list of recipients, and a list of amounts
- Call `transferFrom` on the ERC20 token for each recipient
- Validate that recipient and amount lists are consistent

**Why not just do this in the frontend?**

You could loop in the frontend and send N transactions. But that means:
- N wallet confirmations from the user
- N separate gas fees
- Partial failures if the user closes the browser mid-loop

A single smart contract call is atomic — it either fully succeeds or fully reverts.

---

## The approve/transferFrom pattern

TSender never holds tokens. It relies on the ERC20 allowance mechanism:

1. User calls `token.approve(TSenderAddress, totalAmount)` — grants permission
2. User calls `airdropERC20(...)` — TSender calls `token.transferFrom(user, recipient, amount)` for each recipient
3. If any transfer fails, the entire transaction reverts

This is the standard pattern for contracts that move tokens on behalf of users.

---

## Multi-network support

Contract addresses differ per network. The `chainsToSender` mapping in `constants/index.ts` maps chain IDs to the deployed contract address for that network.

When the user connects their wallet, Wagmi detects the active chain ID. The frontend looks up the correct TSender address from `chainsToSender` before building any transaction.
