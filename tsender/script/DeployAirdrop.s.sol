// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {AirdropContract} from "src/AirdropContract.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployAirdrop is Script {
    function run() public returns (AirdropContract, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        vm.startBroadcast();
        AirdropContract airdropContract = new AirdropContract();
        vm.stopBroadcast();
        return (airdropContract, helperConfig);
    }
}
