// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20Mock} from "test/mock/ERC20Mock.sol";
import {AirdropContract} from "src/AirdropContract.sol";
import {Test} from "forge-std/Test.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {DeployAirdrop} from "script/DeployAirdrop.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirdropContractTest is Test {
    HelperConfig config;
    AirdropContract airdropContract;
    address sender = makeAddr("sender");
    ERC20Mock token;
    address tokenAddress;

    address[] recipients = [makeAddr("recipient1"), makeAddr("recipient2")];
    uint256[] amounts = [1 ether, 2 ether];

    function setUp() public {
        DeployAirdrop deployer = new DeployAirdrop();
        (airdropContract, config) = deployer.run();
        (tokenAddress, ) = config.activeNetworkConfig();
        token = ERC20Mock(tokenAddress);
        ERC20Mock(tokenAddress).mint(sender, 100 ether);
    }

    modifier allowERC20() {
        vm.prank(sender);
        token.approve(address(airdropContract), 100 ether);
        _;
    }

    function test_revertIfNotEnoughAllowance() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                AirdropContract.AirdropContract__InsufficientAllowance.selector,
                address(token)
            )
        );
        vm.prank(sender);
        airdropContract.airdropERC20(
            tokenAddress,
            recipients,
            amounts,
            100 ether
        );
    }

    function test_revertIFNotValidList() public allowERC20 {
        address[] memory invalidRecipients = new address[](0);
        vm.expectRevert(AirdropContract.AirdropContract__InvalidList.selector);
        airdropContract.airdropERC20(
            tokenAddress,
            invalidRecipients,
            amounts,
            0
        );
    }

    function test_areListsValid_revertsOnEmptyList() public {
        address[] memory emptyRecipients = new address[](0);
        uint256[] memory emptyAmounts = new uint256[](0);
        vm.expectRevert(AirdropContract.AirdropContract__InvalidList.selector);
        airdropContract.areListsValid(emptyRecipients, emptyAmounts);
    }

    function test_areListsValid_returnsTrueForValidLists() public {
        address[] memory validRecipients = new address[](2);
        uint256[] memory validAmounts = new uint256[](2);
        validRecipients[0] = address(0x1);
        validRecipients[1] = address(0x2);
        validAmounts[0] = 10 ether;
        validAmounts[1] = 20 ether;
        assertTrue(
            airdropContract.areListsValid(validRecipients, validAmounts)
        );
    }

    function test_areListsValid_revertsOnMismatchedLists() public {
        address[] memory validRecipients = new address[](2);
        uint256[] memory validAmounts = new uint256[](1);
        validRecipients[0] = address(0x1);
        validRecipients[1] = address(0x2);
        validAmounts[0] = 10 ether;
        vm.expectRevert(AirdropContract.AirdropContract__InvalidList.selector);
        airdropContract.areListsValid(validRecipients, validAmounts);
    }

    function test_airdropERC20_transfersTokensToRecipients() public allowERC20 {
        address[] memory validRecipients = new address[](2);
        uint256[] memory validAmounts = new uint256[](2);
        validRecipients[0] = address(0x1);
        validRecipients[1] = address(0x2);
        validAmounts[0] = 10 ether;
        validAmounts[1] = 20 ether;
        vm.prank(sender);
        airdropContract.airdropERC20(
            tokenAddress,
            validRecipients,
            validAmounts,
            0
        );
        assertEq(IERC20(tokenAddress).balanceOf(validRecipients[0]), 10 ether);
        assertEq(IERC20(tokenAddress).balanceOf(validRecipients[1]), 20 ether);
    }
}
