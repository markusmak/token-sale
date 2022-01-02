pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";


contract KycContract is Ownable{
  mapping(address => bool) public allowed;

  function setKycComplete(address _addr) public onlyOwner {
    allowed[_addr] = true;
  }

  function setKycRevoked(address _addr) public onlyOwner {
    allowed[_addr] = true;
  }

  function kycCompleted(address _addr) public view returns(bool) {
    return allowed[_addr];
  }
}
