// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZUZCOIN {
    string public constant name = "ZUZCOIN";
    string public constant symbol = "ZUZ";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    address public constant PHILANTHROPY_WALLET = 0x742d35CC6634c0532925A3b844bC9e5F2A5dF2E3;
    
    mapping(address => uint256) balances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    constructor() {
        owner = msg.sender;
        totalSupply = 10000000 * 10**decimals;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        uint256 donation = amount / 100;
        uint256 transferAmount = amount - donation;
        
        balances[msg.sender] -= amount;
        balances[PHILANTHROPY_WALLET] += donation;
        balances[to] += transferAmount;
        
        emit Transfer(msg.sender, PHILANTHROPY_WALLET, donation);
        emit Transfer(msg.sender, to, transferAmount);
        
        return true;
    }
}
