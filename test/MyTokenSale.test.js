var TokenSale = artifacts.require("MyTokenSale");

var Token = artifacts.require("MyToken");

var Kyc = artifacts.require("KycContract.sol");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: "../.env"})

contract("Token Sale Test", async (accounts) => {

  const [deployerAccount, recipient, anotherAccount] = accounts;

  it("should not have any tokens in my deployerAccount", async () => {
    let instance = await Token.deployed();
    return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("all tokens should be in the TokenSale Smart Contract by defualt", async () => {
    let instance = await Token.deployed();
    let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);
    let totalSupply = await instance.totalSupply();
    return await expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);

  });

  it("should be possible to buy tokens", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let kycInstance = await Kyc.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    await kycInstance.setKycComplete(deployerAccount, {from: deployerAccount});
    await expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", 'wei')})).to.be.fulfilled;
    return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
  })
});