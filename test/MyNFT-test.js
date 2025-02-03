// const { expect } = require("chai");

// describe("MyNFT", function () {
//   let myNFT, owner;

//   beforeEach(async function () {
//     [owner] = await ethers.getSigners();
//     const MyNFT = await ethers.getContractFactory("MyNFT");
//     myNFT = await MyNFT.deploy();
//     await myNFT.deployed();
//   });

//   it("should mint an NFT and emit event", async function () {
//     const tokenURI = "https://example.com/metadata.json";
//     await expect(myNFT.mintNFT(tokenURI))
//       .to.emit(myNFT, "NFTMinted")
//       .withArgs(1, owner.address);
//     expect(await myNFT.tokenCounter()).to.equal(2);
//     expect(await myNFT.tokenURI(1)).to.equal(tokenURI);
//   });
// });
