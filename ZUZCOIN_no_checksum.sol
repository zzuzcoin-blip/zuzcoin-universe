// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZUZCOIN {
    string public name = "ZUZCOIN";
    string public symbol = "ZUZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    address public charityWallet;
    uint256 public constant CHARITY_PERCENT = 1;
    
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CharityTransfer(address indexed from, address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        // Используем hex literal без checksum
        charityWallet = address(0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0);
        totalSupply = 1000000 * 10**decimals;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        uint256 charityAmount = (amount * CHARITY_PERCENT) / 100;
        uint256 netAmount = amount - charityAmount;
        
        balances[msg.sender] -= amount;
        balances[charityWallet] += charityAmount;
        balances[to] += netAmount;
        
        emit Transfer(msg.sender, charityWallet, charityAmount);
        emit Transfer(msg.sender, to, netAmount);
        emit CharityTransfer(msg.sender, to, charityAmount);
        
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Allowance exceeded");
        
        uint256 charityAmount = (amount * CHARITY_PERCENT) / 100;
        uint256 netAmount = amount - charityAmount;
        
        balances[from] -= amount;
        allowances[from][msg.sender] -= amount;
        balances[charityWallet] += charityAmount;
        balances[to] += netAmount;
        
        emit Transfer(from, charityWallet, charityAmount);
        emit Transfer(from, to, netAmount);
        emit CharityTransfer(from, to, charityAmount);
        
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function allowance(address _owner, address spender) public view returns (uint256) {
        return allowances[_owner][spender];
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function setCharityWallet(address newCharityWallet) public onlyOwner {
        charityWallet = newCharityWallet;
    }
}
