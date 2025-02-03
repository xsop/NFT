let provider;
let signer;
let contract;
const contractAddress = "0xa6f79536e3d3a7efa5f0bafa20857281e6cb7127"; 
const abi = [
    "0x689D3F96f19Cf7a986e5f32068033ea81Bc08D01"
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
    if (bidAmount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
    }

    try {
        const tx = await contract.placeBid({
            value: ethers.parseUnits(bidAmount, "ether")
        });

        alert("Transaction sent! Tx Hash: " + tx.hash);
        await tx.wait();
        alert("Bid placed successfully!");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed: " + error.message);
    }
}

async function estimateGas() {
    if (!contract) {
        alert("Please connect your wallet first!");
        return;
    }

    try {
        const bidAmount = document.getElementById("bidAmount").value;
        const gasEstimate = await contract.bid.estimateGas({
            value: ethers.parseUnits(bidAmount, "ether")
        });

        document.getElementById("gasEstimate").innerText = "Gas Estimate: " + gasEstimate.toString();
    } catch (error) {
        console.error("Gas estimation failed:", error);
        alert("Could not estimate gas: " + error.message);
    }
}
