// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CharityToken is ERC20 {
    address public charityWallet;
    uint256 public charityPercent;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _charityWallet,
        uint256 _charityPercent
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        charityWallet = _charityWallet;
        charityPercent = _charityPercent;
    }
    
    // Переопределяем transfer с авто-филантропией
    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 charityAmount = (amount * charityPercent) / 100;
        uint256 transferAmount = amount - charityAmount;
        
        _transfer(msg.sender, charityWallet, charityAmount);
        _transfer(msg.sender, to, transferAmount);
        
        return true;
    }
}

contract TokenFactory {
    address public owner;
    address[] public deployedTokens;
    
    event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 supply);
    
    constructor() {
        owner = msg.sender;
    }
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address charityWallet,
        uint256 charityPercent
    ) external returns (address) {
        require(charityPercent <= 10, "Max 10% charity");
        
        CharityToken newToken = new CharityToken(
            name,
            symbol,
            initialSupply,
            charityWallet,
            charityPercent
        );
        
        deployedTokens.push(address(newToken));
        emit TokenCreated(address(newToken), name, symbol, initialSupply);
        
        return address(newToken);
    }
    
    function getDeployedTokens() external view returns (address[] memory) {
        return deployedTokens;
    }
}
