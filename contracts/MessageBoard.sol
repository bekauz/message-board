// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MessageBoard {

    // state vars
    uint256 postCount;
    uint256 private seed;
    // map poster address to timestamp of last post
    mapping(address => uint256) public lastPostTimestamp;

    // to be emitted upon new post
    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address postUser;
        string message;
        uint256 timestamp;
    }

    // store all the posts
    Post[] posts;

    constructor() payable {
        console.log("MessageBoard constructor call");
        // unix timestamp + block tx difficulty, both pretty random
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function post(string memory _message) public {

        require(
            lastPostTimestamp[msg.sender] + 10 minutes < block.timestamp,
            "Wait 10min before posting again"
        );
        lastPostTimestamp[msg.sender] = block.timestamp;

        postCount += 1;
        console.log("%s has posted '%s'", msg.sender, _message);

        posts.push(Post(msg.sender, _message, block.timestamp));

        // regenerate seed per post
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random generated #: %d", seed);
        if (seed > 50) {

            console.log("%s won 0.0001 eth for posting!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            // validate balance or cancel the tx
            require(
                prizeAmount <= address(this).balance,
                "Amount to be withdrawn exceeds contract balance"
            );
            // transfer the funds and store the tx result in a bool
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw amount");
        }

        emit NewPost(msg.sender, block.timestamp, _message);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getPostCount() public view returns (uint256) {
        console.log("There are %d total posts", postCount);
        return postCount;
    }
}