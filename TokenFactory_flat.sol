// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// TokenFactory without OpenZeppelin imports for easy verification

contract CharityToken {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;
    
    address public charityWallet;
    uint256 public charityPercent;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address _charityWallet,
        uint256 _charityPercent
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        charityWallet = _charityWallet;
        charityPercent = _charityPercent;
        
        _mint(msg.sender, initialSupply * 10 ** _decimals);
    }
    
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        uint256 charityAmount = (amount * charityPercent) / 100;
        uint256 transferAmount = amount - charityAmount;
        
        _transfer(msg.sender, charityWallet, charityAmount);
        _transfer(msg.sender, to, transferAmount);
        
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        
        _totalSupply += amount;
        _balances[account] += amount;
        
        emit Transfer(address(0), account, amount);
    }
}

contract TokenFactory {
    address[] public createdTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        address charityWallet,
        uint256 charityPercent,
        address creator
    );
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address charityWallet,
        uint256 charityPercent
    ) external returns (address) {
        CharityToken newToken = new CharityToken(
            name,
            symbol,
            initialSupply,
            charityWallet,
            charityPercent
        );
        
        address tokenAddress = address(newToken);
        createdTokens.push(tokenAddress);
        
        emit TokenCreated(
            tokenAddress,
            name,
            symbol,
            initialSupply,
            charityWallet,
            charityPercent,
            msg.sender
        );
        
        return tokenAddress;
    }
    
    function getCreatedTokens() external view returns (address[] memory) {
        return createdTokens;
    }
    
    function getTokenCount() external view returns (uint256) {
        return createdTokens.length;
    }
}
