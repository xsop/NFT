// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is Ownable, ERC721URIStorage {
    uint256 public tokenCounter;

    event NFTMinted(uint256 indexed tokenId, address indexed owner);

    constructor() Ownable(msg.sender) ERC721("MyNFT", "MNFT") {
        tokenCounter = 1;
    }

    function mintNFT(string memory tokenURI) external returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;
        emit NFTMinted(tokenId, msg.sender);
        return tokenId;
    }

    function getTokenURI(uint256 tokenId) external view returns (string memory) {
        return tokenURI(tokenId);
    }

    function calculateFee(uint256 amount) external pure returns (uint256) {
        return amount / 1000;
    }
}
