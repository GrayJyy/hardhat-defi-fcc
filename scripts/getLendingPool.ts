import { ethers, network } from 'hardhat'
import { networkConfig } from '../help-hardhat-config'
import networkType from '../types/networkType'
const getLendingPool = async (deployer: string) => {
  const chainId = network.config.chainId as networkType
  const deploySigner = await ethers.getSigner(deployer)
  const LendingPoolProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    networkConfig[chainId].lendingPoolProviderAddress,
    deploySigner
  )
  const lendingPoolAddress = await LendingPoolProvider.getLendingPool()
  const LendingPool = await ethers.getContractAt('ILendingPool', lendingPoolAddress, deploySigner)
  return LendingPool
}
export default getLendingPool
