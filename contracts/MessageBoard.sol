// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MessageBoard {

    // state var
    uint256 postCount;

    constructor() {
        console.log("MessageBoard constructor call");
    }

    function post() public {
        postCount += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getPostCount() public view returns (uint256) {
        console.log("There are %d total posts", postCount);
        return postCount;
    }
}