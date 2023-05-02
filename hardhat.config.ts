import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { config as getConfig } from 'dotenv'
import 'hardhat-deploy' // add this line

getConfig()
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL as string
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: '0.8.18' },
      { version: '0.8.7' },
      {
        version: '0.6.6',
      },
      {
        version: '0.6.12',
      },
      {
        version: '0.4.19',
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 31337, forking: { url: MAINNET_RPC_URL } },
    localhost: { chainId: 31337 },
    sepolia: { chainId: 11155111, url: SEPOLIA_RPC_URL, accounts: [PRIVATE_KEY] },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  // gasReporter: {
  //   enabled: false,
  //   currency: 'USD',
  //   outputFile: 'gas-report.txt',
  //   noColors: true,
  //   // coinmarketcap: COINMARKETCAP_API_KEY,
  // },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
}

export default config
