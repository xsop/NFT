// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract NFTAuction {
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 minBid;
        uint256 highestBid;
        address highestBidder;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;
    MyNFT public nftContract;

    event AuctionCreated(uint256 indexed tokenId, address indexed seller, uint256 minBid);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 bidAmount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 highestBid);

    modifier auctionActive(uint256 tokenId) {
        require(auctions[tokenId].active, "Licitatia nu este activa");
        _;
    }

    constructor(address _nftContractAddress) {
        nftContract = MyNFT(_nftContractAddress);
    }

    function createAuction(uint256 tokenId, uint256 minBid) external {
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Contractul de licitatii nu este aprobat sa transfere NFT-ul"
        );

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            minBid: minBid,
            highestBid: 0,
            highestBidder: address(0),
            active: true
        });

        emit AuctionCreated(tokenId, msg.sender, minBid);
    }

    function placeBid(uint256 tokenId) external payable auctionActive(tokenId) {
        Auction storage auction = auctions[tokenId];
        require(msg.value >= auction.minBid, "Oferta sub limita minima");
        require(msg.value > auction.highestBid, "Oferta trebuie sa fie mai mare decat cea curenta");

        if (auction.highestBidder != address(0)) {
            (bool success, ) = auction.highestBidder.call{value: auction.highestBid}("");
            require(success, "Refund esuat");
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) external auctionActive(tokenId) {
        Auction storage auction = auctions[tokenId];
        require(msg.sender == auction.seller, "Doar vanzatorul poate incheia licitatia");

        auction.active = false;
        if (auction.highestBidder != address(0)) {
            nftContract.transferFrom(address(this), auction.highestBidder, tokenId);
            (bool success, ) = auction.seller.call{value: auction.highestBid}("");
            require(success, "Transferul ETH esuat");
        } else {
            nftContract.transferFrom(address(this), auction.seller, tokenId);
        }
        emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
    }

    function getAuction(uint256 tokenId) external view returns (Auction memory) {
        return auctions[tokenId];
    }

    function calculateFee(uint256 amount) external pure returns (uint256) {
        return amount / 1000;
    }
}
