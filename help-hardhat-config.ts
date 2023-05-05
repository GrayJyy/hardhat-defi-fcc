const networkConfig = {
  31337: {
    name: 'localhost',
    lendingPoolProviderAddress: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    IWethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // IWeth 主网地址 因为这里用的是主网forking
    DaiToEth: '0x773616E4d11A78F511299002da57A0a94577F1f4',
    DaiToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F
  },
  11155111: {
    name: 'sepolia',
    lendingPoolProviderAddress: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    IWethAddress: '0x773616e4d11a78f511299002da57a0a94577f1f4',
    DaiToEth: '0x773616E4d11A78F511299002da57A0a94577F1f4',
    DaiToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
}

const developmentChains = ['localhost', 'hardhat']

export { networkConfig, developmentChains }
