import React, { useEffect } from 'react'
import { BudgetListItem } from '../budgets/interfaces/BudgetListItem'
import { PiggyBank, ReceiptText, Wallet2Icon } from 'lucide-react'

function CardInfo({ budgetList }: { budgetList: BudgetListItem[] }) {

  const [totalBudget, setTotalBudget] = React.useState(0);
  const [totalSpend, setTotalSpend] = React.useState(0);

  useEffect(() => {
    const CalculateCardInfo = () => {
      console.log(budgetList);
      let totalBudget_ = 0;
      let totalSpend_ = 0;
      budgetList.forEach((element) => {
        totalBudget_ += element.amount;
        totalSpend_ += element.totalSpend || 0;
      });

      setTotalBudget(totalBudget_);
      setTotalSpend(totalSpend_);
    }
    CalculateCardInfo();
  }, [budgetList]);




  return (
    budgetList.length > 0 ? (
      <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <div className='p-7 border rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Total Budget</h2>
            <h2 className='font-bold text-2xl'>${totalBudget}</h2>
          </div>
          <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>

        <div className='p-7 border rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Total Spend</h2>
            <h2 className='font-bold text-2xl'>${totalSpend}</h2>
          </div>
          <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>

        <div className='p-7 border rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>No. Of Budget</h2>
            <h2 className='font-bold text-2xl'>{budgetList.length}</h2>
          </div>
          <Wallet2Icon className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>

      </div>
    )
      :
      <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {[1, 2, 3].map((item, index) => (
          <div key={index} className='h-[120px] w-full bg-slate-200 animate-pulse rounded-lg'>
          </div>
        ))}
      </div>


  )
}

export default CardInfo