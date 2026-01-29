// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * ZUZCOIN - Philanthropy Token
 * 1% of every transaction automatically donated to charity
 * Sepolia Testnet Deployment
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZUZCOIN is ERC20, Ownable {
    address public constant PHILANTHROPY_WALLET = 0x742d35Cc6634C0532925a3b844Bc9e5F2A5dF2e3; // Example charity wallet
    
    // Events
    event DonationMade(address indexed from, uint256 amount, uint256 donation);
    event PhilanthropyWalletChanged(address newWallet);
    
    constructor() ERC20("ZUZCOIN", "ZUZ") Ownable(msg.sender) {
        // Mint initial supply: 10,000,000 ZUZ
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }
    
    /**
     * @dev Override transfer to include 1% philanthropy donation
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Calculate 1% donation
        uint256 donation = amount / 100;
        uint256 transferAmount = amount - donation;
        
        // Perform transfer (99% to recipient)
        super._transfer(sender, recipient, transferAmount);
        
        // Send 1% to philanthropy wallet
        super._transfer(sender, PHILANTHROPY_WALLET, donation);
        
        // Emit donation event
        emit DonationMade(sender, amount, donation);
    }
    
    /**
     * @dev Mint additional tokens (only owner)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Get total donated amount
     */
    function totalDonated() public view returns (uint256) {
        return balanceOf(PHILANTHROPY_WALLET);
    }
    
    /**
     * @dev Get philanthropy wallet balance
     */
    function philanthropyBalance() public view returns (uint256) {
        return balanceOf(PHILANTHROPY_WALLET);
    }
}
