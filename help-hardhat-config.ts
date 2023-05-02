const networkConfig = {
  31337: {
    name: 'localhost',
    lendingPoolProviderAddress: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    IWethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // IWeth 主网地址 因为这里用的是主网forking
  },
  11155111: {
    name: 'sepolia',
    lendingPoolProviderAddress: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    IWethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
}

const developmentChains = ['localhost', 'hardhat']

export { networkConfig, developmentChains }
