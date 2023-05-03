import { ethers, getNamedAccounts, network } from 'hardhat'
import getLendingPool from './getLendingPool'
import { getWeth, AMOUNT } from './getWeth'
import { networkConfig } from '../help-hardhat-config'
import networkType from '../types/networkType'
import getBorrowUserData from './getBorrowUserData'

/*
1.铸造流动性代币
2.授权并存入流动性池
3.获取账户状态
 */
async function main() {
  const { deployer } = await getNamedAccounts()
  const deploySigner = await ethers.getSigner(deployer)
  await getWeth(deployer)
  const LendingPool = await getLendingPool(deployer)
  console.log(`LendingPool address is ${LendingPool.address}`)
  const chainId = network.config.chainId as networkType
  const IWethAddress = networkConfig[chainId].IWethAddress
  await approveERC20(IWethAddress, LendingPool.address, AMOUNT, deploySigner)
  await LendingPool.deposit(IWethAddress, AMOUNT, deployer, 0)
  console.log('Deposited!')
  const { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(LendingPool, deployer)
}

const approveERC20 = async (erc20Address: string, spender: string, amount: any, deployer: any) => {
  const ERC20Token = await ethers.getContractAt('IERC20', erc20Address, deployer)
  const tx = await ERC20Token.approve(spender, amount)
  await tx.wait()
  console.log('Approved!')
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
