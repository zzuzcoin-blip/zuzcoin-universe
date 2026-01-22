// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalNotary {
    address public owner;
    uint256 public registrationFee = 100 ether;
    uint256 public tokenCreationFee = 500 ether;
    
    struct Copyright {
        address owner;
        string workHash;
        uint256 timestamp;
        string title;
    }
    
    struct Token {
        address creator;
        string name;
        string symbol;
        address tokenAddress;
        uint256 createdAt;
    }
    
    mapping(string => Copyright) public copyrights;
    mapping(string => Token) public tokens;
    
    event CopyrightRegistered(address indexed owner, string workHash, string title, uint256 timestamp);
    event TokenCreated(address indexed creator, string name, string symbol, address tokenAddress, uint256 timestamp);
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerCopyright(string memory _workHash, string memory _title) public payable {
        require(msg.value >= registrationFee, "Insufficient fee");
        require(bytes(copyrights[_workHash].workHash).length == 0, "Already registered");
        
        copyrights[_workHash] = Copyright({
            owner: msg.sender,
            workHash: _workHash,
            timestamp: block.timestamp,
            title: _title
        });
        
        emit CopyrightRegistered(msg.sender, _workHash, _title, block.timestamp);
    }
    
    function createToken(string memory _name, string memory _symbol) public payable {
        require(msg.value >= tokenCreationFee, "Insufficient fee");
        require(bytes(tokens[_name].name).length == 0, "Token name exists");
        
        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(_name, block.timestamp)))));
        
        tokens[_name] = Token({
            creator: msg.sender,
            name: _name,
            symbol: _symbol,
            tokenAddress: tokenAddress,
            createdAt: block.timestamp
        });
        
        emit TokenCreated(msg.sender, _name, _symbol, tokenAddress, block.timestamp);
    }
    
    function getCopyright(string memory _workHash) public view returns (address, string memory, uint256, string memory) {
        Copyright memory c = copyrights[_workHash];
        return (c.owner, c.workHash, c.timestamp, c.title);
    }
    
    function withdrawFees() public {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
