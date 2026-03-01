# TSender

> Airdrop ERC20 tokens to multiple recipients in a single transaction, across multiple networks.

TSender is a fullstack Web3 project built as part of the [Cyfrin Updraft](https://updraft.cyfrin.io) curriculum. It is intentionally written to production quality — every architectural decision is documented so you can understand not just *what* was built, but *why*.

If you are learning Web3 development, this project is meant to be read, questioned, and contributed to.

---

## What it does

TSender lets a token holder airdrop ERC20 tokens to a list of recipients without sending N separate transactions. Instead:

1. The sender approves the TSender contract to spend their tokens
2. The sender calls `airdropERC20` with a list of recipients and amounts
3. The contract distributes the tokens in a single on-chain transaction

This saves gas, reduces complexity, and works across multiple EVM-compatible networks.

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | [Next.js](https://nextjs.org) + TypeScript | App Router, strong typing, production-ready |
| Web3 UI | [RainbowKit](https://rainbowkit.com) | Best-in-class wallet connection UX |
| Web3 hooks | [Wagmi](https://wagmi.sh) | React hooks for EVM, pairs well with RainbowKit |
| Forms | [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev) | Performant forms with schema validation |
| UI components | [shadcn/ui](https://ui.shadcn.com) | Accessible, unstyled-first, easy to own |
| Smart contract | Solidity + [OpenZeppelin](https://openzeppelin.com/contracts) | Industry standard, audited primitives |
| Contract tooling | [Foundry](https://book.getfoundry.sh) | Fast, Solidity-native testing and deployment |
| Local chain | [Anvil](https://book.getfoundry.sh/anvil) | Local EVM node, part of Foundry |

---

## Project structure

```
tsender-ui/
├── app/                  # Next.js App Router pages and layout
├── components/           # React UI components
│   ├── forms/            # Airdrop form
│   ├── form-generator/   # Generic form field components
│   └── ui/               # shadcn/ui primitives
├── constants/            # Chain config, ABIs, contract addresses
├── hooks/                # Custom React hooks (form logic, Web3 interactions)
├── schemas/              # Zod validation schemas
├── docs/                 # Project documentation
└── tsender/              # Foundry smart contract project
    ├── src/              # Solidity contracts
    └── test/             # Foundry tests
```

---

## Getting started

See [docs/local-setup.md](docs/local-setup.md) for the full step-by-step guide.

**Prerequisites:** Node.js, Bun, Foundry

```bash
# Install frontend dependencies
bun install

# Run the frontend
bun dev
```

For the smart contract and local chain setup, follow [docs/local-setup.md](docs/local-setup.md).

---

## Documentation

- [Architecture](docs/architecture.md) — how the UI and smart contract fit together
- [Local setup](docs/local-setup.md) — run the full stack locally
- [Smart contract](docs/contract.md) — how the airdrop contract works
- [Contributing](docs/CONTRIBUTING.md) — how to contribute and discuss

---

## Contributing

This project welcomes contributions, questions, and discussions — especially around best practices.

If you are a Cyfrin learner, an experienced developer who spots something to improve, or just curious, open an issue or a discussion. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## Resources

- [Cyfrin Updraft](https://updraft.cyfrin.io) — where this project was built
- [Foundry Book](https://book.getfoundry.sh)
- [Wagmi docs](https://wagmi.sh)
- [OpenZeppelin docs](https://docs.openzeppelin.com)
