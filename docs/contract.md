# Smart contract

The TSender smart contract is located in `tsender/src/AirdropContract.sol`.

---

## What it does

It exposes two functions:

### `airdropERC20`

```solidity
function airdropERC20(
    address tokenAddress,
    address[] calldata recipients,
    uint256[] calldata amounts,
    uint256 totalAmount
) external
```

Distributes ERC20 tokens from the caller to a list of recipients.

**How it works:**

1. Checks that recipients and amounts lists are valid (same length, non-empty)
2. Verifies the caller has approved at least `totalAmount` to this contract
3. Calls `transferFrom(msg.sender, recipient, amount)` for each recipient

**Why pass `totalAmount`?**

Summing an array on-chain costs gas proportional to its length. The caller computes the total off-chain and passes it in, allowing the contract to verify the allowance upfront and fail fast before wasting gas on a partial loop.

---

### `areListsValid`

```solidity
function areListsValid(
    address[] calldata recipients,
    uint256[] calldata amounts
) external pure returns (bool)
```

Returns `true` if:

- Both lists are non-empty
- Both lists have the same length

This is a `pure` function — it reads no state and costs minimal gas. It is also called internally by `airdropERC20` as a guard.

---

## The approve/transferFrom pattern

Before calling `airdropERC20`, the user must approve the contract:

```
token.approve(AirdropContractAddress, totalAmount)
```

This is the standard ERC20 allowance pattern. TSender never holds tokens — it only moves them from the caller's wallet to recipients using the granted allowance.

The frontend handles this automatically: when you click "Send Tokens", it checks the current allowance and fires an `approve` transaction first if needed, waits for it to be mined, then calls `airdropERC20`.

---

## Custom errors

```solidity
error AirdropContract__InvalidList();
error AirdropContract__InsufficientAllowance(address tokenAddress);
```

Custom errors are used instead of `require` strings — they cost less gas and are easier to handle programmatically on the frontend.

---

## Dependencies

- [OpenZeppelin IERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20) — interface for interacting with ERC20 tokens

---

## Testing

Tests are in `tsender/test/`. Run them with:

```bash
cd tsender
forge test
```

For verbose output:

```bash
forge test -vvv
```

For coverage:

```bash
forge coverage
```
