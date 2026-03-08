// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ERC20Mock} from "test/mock/ERC20Mock.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address tokenAddress;
        uint256 deployerKey;
    }

    NetworkConfig public activeNetworkConfig;

    uint256 public constant DEFAULT_ANVIL_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 public constant INITIAL_SUPPLY = 100 ether;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                tokenAddress: 0x694AA1769357215DE4FAC081bf1f309aDC325306,
                deployerKey: vm.envOr("PRIVATE_KEY", uint256(0))
            });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.tokenAddress != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        ERC20Mock token = new ERC20Mock(
            "Token",
            "TKN",
            address(this),
            INITIAL_SUPPLY
        );
        vm.stopBroadcast();
        return
            NetworkConfig({
                tokenAddress: address(token),
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }
}
