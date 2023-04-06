// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
contract FeeToken is ERC20 {
    address public taxWallet;
    uint256 public taxPercentage;

    constructor(uint256 _initialSupply, address _taxWallet, uint256 _taxPercentage) ERC20("Fee Token", "FEE") {
        _mint(msg.sender, _initialSupply);
        taxWallet = _taxWallet;
        taxPercentage = _taxPercentage;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 feeAmount = amount * taxPercentage / 100;
        _transfer(msg.sender, taxWallet, feeAmount );
        _transfer(msg.sender, recipient, (amount - feeAmount));
        return true;
    }
}