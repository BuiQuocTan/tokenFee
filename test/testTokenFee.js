const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FeeToken", function () {
  let feeToken;
  let owner;
  let taxWallet;
  const initialSupply = ethers.utils.parseEther("1000000");
  const taxPercentage = 2;

  beforeEach(async function () {
    [owner,user1, taxWallet] = await ethers.getSigners();
    const FeeToken = await ethers.getContractFactory("FeeToken");
    feeToken = await FeeToken.connect(owner).deploy(initialSupply, taxWallet.address, taxPercentage);
    await feeToken.deployed();
  });

  it("should have correct name, symbol, and decimal places", async function () {
    expect(await feeToken.name()).to.equal("Fee Token");
    expect(await feeToken.symbol()).to.equal("FEE");
    expect(await feeToken.decimals()).to.equal(18);
  });

  it("should transfer tokens with fee deducted", async function () {
    const transferAmount = ethers.utils.parseEther("1");

    await feeToken.connect(owner).transfer(user1.address, transferAmount);

    const expectedFeeAmount = transferAmount.mul(taxPercentage).div(100);
    const expectedRecipientAmount = transferAmount.sub(expectedFeeAmount);

    expect(await feeToken.balanceOf(owner.address)).to.equal(initialSupply.sub(transferAmount));
    expect(await feeToken.balanceOf(taxWallet.address)).to.equal(expectedFeeAmount);
    expect(await feeToken.balanceOf(user1.address)).to.equal(expectedRecipientAmount);
  });

});
