// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * ZUZCOIN - Philanthropy Token
 * 1% of every transaction automatically donated to charity
 * Sepolia Testnet Deployment
 */

// OpenZeppelin ERC20 Implementation (flattened)
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ERC20 is Context, IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
    
    function name() public view virtual returns (string memory) {
        return _name;
    }
    
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view virtual returns (uint8) {
        return 18;
    }
    
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        _beforeTokenTransfer(from, to, amount);
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
        _afterTokenTransfer(from, to, amount);
    }
    
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        
        _beforeTokenTransfer(address(0), account, amount);
        
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
        _afterTokenTransfer(address(0), account, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
}

abstract contract Ownable is Context {
    address private _owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }
    
    modifier onlyOwner() {
        _checkOwner();
        _;
    }
    
    function owner() public view virtual returns (address) {
        return _owner;
    }
    
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }
    
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }
    
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }
    
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// Main ZUZCOIN Contract
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
