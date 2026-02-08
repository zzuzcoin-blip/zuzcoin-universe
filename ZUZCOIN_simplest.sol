// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZUZCOIN {
    string public name = "ZUZCOIN";
    string public symbol = "ZUZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    
    constructor() {
        totalSupply = 1000000 * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
