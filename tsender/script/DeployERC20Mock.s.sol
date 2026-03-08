// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ERC20Mock} from "test/mock/ERC20Mock.sol";

contract DeployERC20Mock is Script {
    function run() public returns (ERC20Mock) {
        vm.startBroadcast();
        ERC20Mock token = new ERC20Mock(
            "Test Token",
            "TST",
            msg.sender,
            1_000_000 ether
        );
        vm.stopBroadcast();
        return token;
    }
}
