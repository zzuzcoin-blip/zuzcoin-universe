// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DigitalNotary {
    struct NotaryRecord {
        bytes32 documentHash;
        address author;
        uint256 timestamp;
        string description;
    }
    
    mapping(bytes32 => NotaryRecord) public records;
    bytes32[] public allHashes;
    
    event DocumentNotarized(bytes32 indexed documentHash, address indexed author, uint256 timestamp);
    event DocumentVerified(bytes32 indexed documentHash, bool isValid);
    
    // Заверить документ (создать неизменяемую запись)
    function notarizeDocument(string memory documentHash, string memory description) external {
        bytes32 hash = keccak256(abi.encodePacked(documentHash));
        
        require(records[hash].timestamp == 0, "Document already notarized");
        
        records[hash] = NotaryRecord({
            documentHash: hash,
            author: msg.sender,
            timestamp: block.timestamp,
            description: description
        });
        
        allHashes.push(hash);
        emit DocumentNotarized(hash, msg.sender, block.timestamp);
    }
    
    // Проверить документ
    function verifyDocument(string memory documentHash) external view returns (bool, address, uint256) {
        bytes32 hash = keccak256(abi.encodePacked(documentHash));
        NotaryRecord memory record = records[hash];
        
        bool exists = record.timestamp > 0;
        return (exists, record.author, record.timestamp);
    }
    
    // Получить все заверенные документы
    function getAllRecords() external view returns (NotaryRecord[] memory) {
        NotaryRecord[] memory result = new NotaryRecord[](allHashes.length);
        
        for (uint256 i = 0; i < allHashes.length; i++) {
            result[i] = records[allHashes[i]];
        }
        
        return result;
    }
}
