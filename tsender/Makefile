.PHONY: all test clean deploy fund help install snapshot format anvil zktest coverage wallets import-wallet

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEFAULT_ZKSYNC_LOCAL_KEY := 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110

all: clean remove install update build

#Clean Cargo
clean :; cargo clean

test :; forge test

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 10


install :; forge install OpenZeppelin/openzeppelin-contracts@v5.5.0 && forge install Cyfrin/foundry-devops@0.4.0

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

deploy:
	@forge script script/DeployAirdrop.s.sol:DeployAirdrop $(NETWORK_ARGS)

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(METAMAST_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy-sepolia:
	@forge script script/DeployAirdrop.s.sol:DeployAirdrop \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--account $(METAMAST_ACCOUNT) \
		--broadcast --verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		-vvvv

wallets:; cast wallet list
# Import a wallet by name + private key
import-wallet:
	@if [ -z "$(WALLET_NAME)" ]; then \
		echo "Usage: make import-wallet WALLET_NAME=<name> "; \
		exit 1; \
	fi
	@cast wallet import $(WALLET_NAME) --interactive

ERC20_ADDRESS := 0x5FbDB2315678afecb367f032d93F642f64180aa3

mint-tokens:
	@if [ -z "$(RECIPIENT)" ]; then \
		echo "Usage: make mint-tokens RECIPIENT=<address>"; \
		exit 1; \
	fi
	@cast send $(ERC20_ADDRESS) "mint(address,uint256)" $(RECIPIENT) 1000000000000000000000 \
		--rpc-url http://localhost:8545 \
		--private-key $(DEFAULT_ANVIL_KEY)
