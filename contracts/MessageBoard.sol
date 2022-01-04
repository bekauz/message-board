// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MessageBoard {

    // state var
    uint256 postCount;

    // to be emitted upon new post
    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address postUser;
        string message;
        uint256 timestamp;
    }

    // store all the posts
    Post[] posts;

    constructor() {
        console.log("MessageBoard constructor call");
    }

    function post(string memory _message) public {
        postCount += 1;
        console.log("%s has posted '%s'", msg.sender, _message);

        posts.push(Post(msg.sender, _message, block.timestamp));

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