import { ethers, getNamedAccounts, network } from 'hardhat'
import getLendingPool from './getLendingPool'
import { getWeth, AMOUNT } from './getWeth'
import { networkConfig } from '../help-hardhat-config'
import networkType from '../types/networkType'
import getBorrowUserData from './getBorrowUserData'

const chainId = network.config.chainId as networkType
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

  const IWethAddress = networkConfig[chainId].IWethAddress
  await approveERC20(IWethAddress, LendingPool.address, AMOUNT, deploySigner)
  await LendingPool.deposit(IWethAddress, AMOUNT, deployer, 0)
  console.log('Deposited!')
  const { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(LendingPool, deployer)
  const daiPrice = await getDaiPrice()
  const availableBorrowsDai = (availableBorrowsETH.toString() as any) * 0.95 * (1 / daiPrice.toNumber()) // 0.95是为了留有余地
  console.log(`You can borrow ${availableBorrowsDai.toString()} DAI`) // 用于展示
  const amountDaiToBorrowWei = ethers.utils.parseEther(availableBorrowsDai.toString()) // 用于后续使用
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
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
