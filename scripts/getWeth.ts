import { ethers, getNamedAccounts, network } from 'hardhat'
import { networkConfig } from '../help-hardhat-config'
import type networkType from '../types/networkType'
const AMOUNT = ethers.utils.parseEther('0.02')

const getWeth = async (deployer: string) => {
  const deploySigner = await ethers.getSigner(deployer)
  const chainId = network.config.chainId as networkType
  // const accounts = await ethers.getSigners()
  // const deployer = accounts[0]
  const IWeth = await ethers.getContractAt('IWeth', networkConfig[chainId].IWethAddress, deploySigner)
  const tx = await IWeth.deposit({ value: AMOUNT })
  await tx.wait()
  const balance = (await IWeth.balanceOf(deployer)).toString()
  console.log(`balance of ${deployer} is ${ethers.utils.formatEther(balance)} weth`)
}
export { getWeth, AMOUNT }
