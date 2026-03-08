# Contributing

TSender is a learning project built at Cyfrin. Contributions, questions, and discussions are welcome — especially around best practices.

---

## Who should contribute

- **Cyfrin learners** — if you are going through the same curriculum, this is a good place to compare approaches and discuss decisions
- **Experienced developers** — if you spot something to improve, a pattern that could be done better, or a security concern, open an issue
- **Anyone curious** — if something in the code or docs is unclear, that is worth raising too

---

## How to contribute

1. **Open an issue first** for any non-trivial change — discuss before coding
2. Fork the repo and create a branch from `main`
3. Make your changes with clear, focused commits
4. Open a pull request with a description of what you changed and why

---

## Discussion guidelines

This project values:

- **Explaining the why** — not just what the code does, but why it was written that way
- **Constructive critique** — pointing out a better approach is welcome, dismissiveness is not
- **Learning in public** — mistakes and questions are part of the process

---

## Code standards

- Solidity: follow the [Solidity style guide](https://docs.soliditylang.org/en/latest/style-guide.html), use OpenZeppelin primitives where appropriate
- TypeScript: strict mode, no `any`, prefer explicit types
- Commits: clear messages that describe intent, not just action (`fix: handle empty recipients list` not `fix bug`)
- Tests: every contract function should have a corresponding Foundry test; frontend logic should be covered by Vitest unit tests (pure functions, Zod schemas, component rendering)

---

## Resources

- [Cyfrin Updraft](https://updraft.cyfrin.io)
- [Foundry Book](https://book.getfoundry.sh)
- [OpenZeppelin docs](https://docs.openzeppelin.com)
- [Wagmi docs](https://wagmi.sh)
