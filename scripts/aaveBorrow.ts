import { ethers, getNamedAccounts, network } from 'hardhat'
import getLendingPool from './getLendingPool'
import { getWeth, AMOUNT } from './getWeth'
import { networkConfig } from '../help-hardhat-config'
import networkType from '../types/networkType'
import getBorrowUserData from './getBorrowUserData'
import { Address } from 'hardhat-deploy/dist/types'
import { ILendingPool } from '../typechain-types'

const chainId = network.config.chainId as networkType
/*
1.铸造流动性代币
2.授权并存入流动性池
3.获取账户状态
4.借钱
 */
async function main() {
  const { deployer } = await getNamedAccounts()
  const deploySigner = await ethers.getSigner(deployer)
  await getWeth(deployer)
  const LendingPool = await getLendingPool(deployer)
  console.log(`LendingPool address is ${LendingPool.address}`)

  const IWethAddress = networkConfig[chainId].IWethAddress
  await approveERC20(IWethAddress, LendingPool.address, AMOUNT, deploySigner)
  await LendingPool.deposit(IWethAddress, AMOUNT, deployer, 0)
  console.log('Deposited!')
  const { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(LendingPool, deployer)
  const daiPrice = await getDaiPrice()
  const availableBorrowsDai = (availableBorrowsETH.toString() as any) * 0.95 * (1 / daiPrice.toNumber()) // 0.95是为了留有余地
  console.log(`You can borrow ${availableBorrowsDai.toString()} DAI`) // 用于展示
  const amountDaiToBorrowWei = ethers.utils.parseEther(availableBorrowsDai.toString()) // 用于后续使用
  // borrow time
  await borrowDai(networkConfig[chainId].DaiToken, LendingPool, amountDaiToBorrowWei, deployer)
  await getBorrowUserData(LendingPool, deployer)
  await repayDai(networkConfig[chainId].DaiToken, LendingPool, amountDaiToBorrowWei, deployer)
  await getBorrowUserData(LendingPool, deployer)
}

const approveERC20 = async (erc20Address: string, spender: string, amount: any, deployer: any) => {
  const ERC20Token = await ethers.getContractAt('IERC20', erc20Address, deployer)
  const tx = await ERC20Token.approve(spender, amount)
  await tx.wait()
  console.log('Approved!')
}
const getDaiPrice = async () => {
  const DaiToEthPriceFeed = await ethers.getContractAt('AggregatorV3Interface', networkConfig[chainId].DaiToEth)
  const price = (await DaiToEthPriceFeed.latestRoundData())[1] // 可以点进去latestRoundData函数查看返回值，返回的是一个数组，数组里的第二个元素answer里有需要的数据
  console.log(`Dai/Eth is ${price.toString()}`)
  return price
}
const borrowDai = async (daiAddress: Address, LendingPool: ILendingPool, amountDaiToBorrow: any, account: any) => {
  const borrowTx = await LendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account)
  await borrowTx.wait()
  console.log("You've borrowed!")
}
const repayDai = async (daiAddress: Address, LendingPool: ILendingPool, amountDaiToRepay: any, account: any) => {
  const signer = await ethers.getSigner(account)
  await approveERC20(daiAddress, LendingPool.address, amountDaiToRepay, signer)
  const repayTx = await LendingPool.repay(daiAddress, amountDaiToRepay, 1, account)
  await repayTx.wait()
  console.log("You've repayed!")
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
