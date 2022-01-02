// Use chai and mochi

const Token = artifacts.require("MyToken");
require('dotenv').config({path: "../.env"})

let chai = require("./chaisetup.js")
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async (accounts) => {

  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async() => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS); // new contract deploy
  })

  it("all tokens should be in my account", async () => {
    // let instance = await Token.deployed(); // take the deployed version from the migrations file
    let instance = this.myToken
    let totalSupply = await instance.totalSupply();
    //let balance = await instance.balanceOf(accounts[0])
    //assert.equal(balance.valueOf(), initialSupply.valueOf(), "The balance was not the same");
    return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
  })

  it("is possible to send tokens between accounts", async () => {
    //let instance = await Token.deployed();
    let instance = this.myToken
    let totalSupply = await instance.totalSupply();
    await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    await expect(instance.transfer(recipient, 1000)).to.eventually.be.fulfilled;
    await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(1000)));
    return await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
  });
  

  it("is not possible to send more tokens than available in total", async () => {
    //let instance = await Token.deployed();
    let instance = this.myToken
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);
    await expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;
    return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  })

})