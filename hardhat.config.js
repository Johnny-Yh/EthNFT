require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-etherscan");


const config = require('./.private.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${config.alchemy.ropsten.apiKey}`,
      accounts: [config.account.ropsten.key, config.account.ropsten.userA, config.account.ropsten.userB],
      gasPrice: 5e10
    },
    // kovan: {
    //   url: `https://eth-kovan.alchemyapi.io/v2/${config.alchemy.kovan.apiKey}`,
    //   accounts: [config.account.kovan.key, config.account.kovan.userA, config.account.kovan.userB],
    //   gasPrice:5e10
    // },
    // mainnet: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${config.alchemy.mainnet.apiKey}`,
    //   accounts: [config.account.mainnet.key, config.account.mainnet.userA, config.account.mainnet.userB],
    //   gasPrice:5e10
    // },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "3WBU723HM359J86ECS2SZT52UIM2DI15UH",
  },
}