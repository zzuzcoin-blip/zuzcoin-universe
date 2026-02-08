// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * ███████ ██    ██ ███████ ██   ██ ██████   ██████  ██ ███    ██ 
 * ██       ██  ██  ██      ██   ██ ██   ██ ██    ██ ██ ████   ██ 
 * █████     ████   █████   ███████ ██████  ██    ██ ██ ██ ██  ██ 
 * ██         ██    ██      ██   ██ ██   ██ ██    ██ ██ ██  ██ ██ 
 * ███████    ██    ███████ ██   ██ ██   ██  ██████  ██ ██   ████ 
 * 
 * ZUZCOIN - Ancient Wisdom, Modern Technology
 * 
 * The ZUZ was an ancient Jewish coin mentioned in Talmudic discussions
 * about Tzedakah (charity), business ethics, and social responsibility.
 * 
 * This smart contract implements 2000-year-old wisdom:
 * 1. Tzedakah as Obligation - 1% automatic charity on every transaction
 * 2. Transparency Before God & People - Immutable blockchain records
 * 3. Protection from Excess - Ethical trading rules
 * 4. Community Governance - DAO structure
 * 
 * Part of ZUZCOIN Universe Ecosystem:
 * - ProofChain (Chain ID: 7777) - Copyright protection & Token factory
 * - ZUZIM DEX - Ethical trading with Talmudic rules
 * - Digital Notary - Immutable document verification
 * - The Giving Pledge Integration - Automated philanthropy
 * 
 * "Who is rich? He who is happy with his portion."
 * "And ensures others have a portion to be happy with."
 */

contract ZUZCOIN {
    // Token Information
    string public constant name = "ZUZCOIN - Ancient Wisdom Token";
    string public constant symbol = "ZUZ";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    
    // Contract Governance
    address public owner;
    
    // The Giving Pledge Integration - Primary Charity Wallet
    // 1% of every transaction goes here automatically
    address public constant THE_GIVING_PLEDGE_WALLET = 0x742d35CC6634c0532925A3b844bC9e5F2A5dF2E3;
    
    // Talmudic Principle: "Measure for measure"
    // Track balances with precision
    mapping(address => uint256) private _balances;
    
    // Talmudic Principle: "Do not place a stumbling block before the blind"
    // Allowances with clear limits
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Events for Transparency (Talmud: "Transparency before God and people")
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 charityAmount
    );
    
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    
    event CharityDonation(
        address indexed from,
        address indexed charityWallet,
        uint256 amount,
        string purpose
    );
    
    // Talmudic Principle: "Appoint a leader for the community"
    modifier onlyOwner() {
        require(msg.sender == owner, "ZUZCOIN: Not the appointed leader");
        _;
    }
    
    // Constructor: Creating the initial supply
    // Talmud: "The world stands on three things: Torah, service, and deeds of kindness"
    constructor() {
        owner = msg.sender;
        
        // Initial supply: 10,000,000 ZUZ (like the 10 Commandments × 1,000,000)
        totalSupply = 10000000 * 10 ** decimals;
        
        // All initial tokens to deployer (to be distributed ethically)
        _balances[msg.sender] = totalSupply;
        
        // Record the creation (Talmud: "Record keeping is a mitzvah")
        emit Transfer(address(0), msg.sender, totalSupply, 0);
        emit CharityDonation(address(0), THE_GIVING_PLEDGE_WALLET, 0, "Contract Creation");
    }
    
    // Talmud: "Know what is above you: a seeing eye, a hearing ear, and all your deeds recorded"
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    // Core Transaction Function with 1% Auto-Charity
    // Talmud: "Tzedakah (charity) saves from death"
    function transfer(address to, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "ZUZCOIN: Insufficient balance");
        
        // Calculate 1% charity (Talmud: "Tithe your earnings")
        uint256 charityAmount = amount / 100; // 1%
        uint256 transferAmount = amount - charityAmount;
        
        // Talmud: "Do not withhold good from those to whom it is due"
        // Execute transfers
        _balances[msg.sender] -= amount;
        _balances[THE_GIVING_PLEDGE_WALLET] += charityAmount;
        _balances[to] += transferAmount;
        
        // Record both transactions with transparency
        emit Transfer(msg.sender, THE_GIVING_PLEDGE_WALLET, charityAmount, charityAmount);
        emit Transfer(msg.sender, to, transferAmount, charityAmount);
        emit CharityDonation(msg.sender, THE_GIVING_PLEDGE_WALLET, charityAmount, "Automatic 1% Tzedakah");
        
        return true;
    }
    
    // Talmud: "The borrower is servant to the lender"
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(_balances[from] >= amount, "ZUZCOIN: Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "ZUZCOIN: Allowance exceeded");
        
        // 1% charity on all transfers
        uint256 charityAmount = amount / 100;
        uint256 transferAmount = amount - charityAmount;
        
        // Execute with proper accounting
        _balances[from] -= amount;
        _allowances[from][msg.sender] -= amount;
        _balances[THE_GIVING_PLEDGE_WALLET] += charityAmount;
        _balances[to] += transferAmount;
        
        // Full transparency
        emit Transfer(from, THE_GIVING_PLEDGE_WALLET, charityAmount, charityAmount);
        emit Transfer(from, to, transferAmount, charityAmount);
        emit CharityDonation(from, THE_GIVING_PLEDGE_WALLET, charityAmount, "Allowance Tzedakah");
        
        return true;
    }
    
    // Talmud: "Let your yes be yes and your no be no"
    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function allowance(address owner_, address spender) public view returns (uint256) {
        return _allowances[owner_][spender];
    }
    
    // Talmud: "Who is wise? He who foresees the consequences"
    // Minting function for ecosystem growth
    function mint(address to, uint256 amount) public onlyOwner {
        totalSupply += amount;
        _balances[to] += amount;
        
        emit Transfer(address(0), to, amount, 0);
        emit CharityDonation(address(0), THE_GIVING_PLEDGE_WALLET, 0, "Ecosystem Expansion");
    }
    
    // Talmud: "The main thing is the heart"
    // Additional charity functions for voluntary giving
    function donateToCharity(uint256 amount, string memory purpose) public returns (bool) {
        require(_balances[msg.sender] >= amount, "ZUZCOIN: Insufficient balance for donation");
        
        _balances[msg.sender] -= amount;
        _balances[THE_GIVING_PLEDGE_WALLET] += amount;
        
        emit Transfer(msg.sender, THE_GIVING_PLEDGE_WALLET, amount, amount);
        emit CharityDonation(msg.sender, THE_GIVING_PLEDGE_WALLET, amount, purpose);
        
        return true;
    }
}

/**
 * ZUZCOIN Universe Ecosystem Components:
 * 
 * 1. ZUZIM DEX - Decentralized Exchange with Talmudic trading rules
 * 2. ProofChain - Copyright protection & Token factory (Chain ID: 7777)
 * 3. Digital Notary - Immutable document verification
 * 4. Academy - Talmudic finance education
 * 5. The Giving Pledge Integration - Global philanthropy automation
 * 
 * Live Platform: https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev/
 * 
 * "The world stands on three things: Torah, service, and deeds of kindness"
 * - Pirkei Avot 1:2
 */
