let provider;
let signer;
let contract;
const contractAddress = "0x31bb1DF3a7CBcAeAA06C11c8eC37Ec770354a505"; 
const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_nftContractAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "minBid",
                "type": "uint256"
            }
        ],
        "name": "AuctionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "highestBid",
                "type": "uint256"
            }
        ],
        "name": "AuctionEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "bidder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "bidAmount",
                "type": "uint256"
            }
        ],
        "name": "BidPlaced",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minBid",
                "type": "uint256"
            }
        ],
        "name": "createAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "endAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "placeBid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "auctions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "minBid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "highestBid",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "highestBidder",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "calculateFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getAuction",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minBid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "highestBid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "highestBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTAuction.Auction",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nftContract",
        "outputs": [
            {
                "internalType": "contract MyNFT",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        document.getElementById("account").innerText = "Connected: " + await signer.getAddress();
        
        const balance = await provider.getBalance(await signer.getAddress());
        document.getElementById("balance").innerText = "Balance: " + ethers.formatEther(balance) + " ETH";

        contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        alert("Please install MetaMask!");
    }
}

async function placeBid() {
    if (!contract) {
        alert("Please connect your wallet first!");
        return;
    }

    const bidAmount = document.getElementById("bidAmount").value;
    const tokenId = 1; 

    if (bidAmount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
    }

    try {
        const auction = await contract.getAuction(tokenId);
        console.log("Auction:", auction);

        if (!auction.active) {
            alert("Auction is NOT active!");
            return;
        }

        if (ethers.parseUnits(bidAmount, "ether") <= auction.highestBid) {
            alert("Your bid must be higher than the current highest bid!");
            return;
        }

        const tx = await contract.placeBid(tokenId, {  
            value: ethers.parseUnits(bidAmount, "ether")
        });

        alert("Transaction sent! Tx Hash: " + tx.hash);
        await tx.wait();
        alert("Bid placed successfully!");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed: " + (error.reason || error.message));
    }
}




async function estimateGas() {
    if (!contract) {
        alert("Please connect your wallet first!");
        return;
    }

    try {
        const bidAmount = document.getElementById("bidAmount").value;
        const tokenId = 1; 
        const gasEstimate = await contract.placeBid.estimateGas(tokenId, {
            value: ethers.parseUnits(bidAmount, "ether")
        });

        document.getElementById("gasEstimate").innerText = "Gas Estimate: " + gasEstimate.toString();
    } catch (error) {
        console.error("Gas estimation failed:", error);
        alert("Could not estimate gas: " + (error.reason || error.message));
    }
}





