
require("ethers");
const {expect} = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');

exports.deployERC20 = async function (total, name, symbol, decimals) {

        const ERC20Contract = await ethers.getContractFactory("UERC20");
    
        const CERC20 = await ERC20Contract.deploy(total, name, symbol, decimals);
        
        const tx = CERC20.deployTransaction;
        await tx.wait(1);
    
        console.log(`>>> [DPLY]: USDT deployed, address=${CERC20.address}, block=${tx.blockNumber}`);
    
        return CERC20;
}

exports.deployUSDT = async function () {

    const ERC20Contract = await ethers.getContractFactory("UERC20");

    const CUSDT = await ERC20Contract.deploy("10000000000000000", "USDT Test Token", "USDT", 6);
    
    const tx = CUSDT.deployTransaction;
    await tx.wait(1);

    console.log(`>>> [DPLY]: USDT deployed, address=${CUSDT.address}, block=${tx.blockNumber}`);

    return CUSDT;
}


exports.printContracts = function (format, contracts) {

    console.log("\n Contracts deployed:\n=========================");
    if (format === "json") {
        Object.entries(contracts).forEach((e) => {
            const [k, v] = e;
            console.log(`${k}: "${v}",`);
        })
    } else {
        Object.entries(contracts).forEach((e) => {
            const [k, v] = e;
            console.log(`| ${k} |  ${v} | `);
        })
    }
}