import { ethers } from 'hardhat'
import { ILendingPool } from '../typechain-types'

const getBorrowUserData = async (pool: ILendingPool, account: string) => {
  // totalCollateralETH 质押的代币和可借的代币并不等同，一般来说可借的都比质押的数量要少。
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await pool.getUserAccountData(account)
  console.log(`你一共质押了价值相当于 ${ethers.utils.formatEther(totalCollateralETH)} eth 的流动性代币`)
  console.log(`你一共借了价值相当于 ${ethers.utils.formatEther(totalDebtETH)} eth 的流动性代币`)
  console.log(`你目前还可以借价值相当于 ${ethers.utils.formatEther(availableBorrowsETH)} eth 的流动性代币`)
  return { availableBorrowsETH, totalDebtETH }
}
export default getBorrowUserData
