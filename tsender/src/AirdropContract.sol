// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirdropContract {
    error AirdropContract__InvalidList();
    error AirdropContract__InsufficientAllowance(address tokenAddress);

    function airdropERC20(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
    ) external {
        if (
            IERC20(tokenAddress).allowance(msg.sender, address(this)) <
            totalAmount
        ) {
            revert AirdropContract__InsufficientAllowance(tokenAddress);
        }
        if (!areListsValid(recipients, amounts)) {
            revert AirdropContract__InvalidList();
        }
        for (uint256 i = 0; i < recipients.length; i++) {
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                recipients[i],
                amounts[i]
            );
        }
    }

    function areListsValid(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) public pure returns (bool) {
        if (recipients.length == 0 || recipients.length != amounts.length) {
            revert AirdropContract__InvalidList();
        }

        return true;
    }
}
