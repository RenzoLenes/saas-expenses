import React from 'react'
import { ExpenseListItem } from '../interfaces/ExpenseListItem'
import { Trash } from 'lucide-react'
import { db } from '@/utils/dbConfig'
import { Expenses } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function ExpenseListTable({ expensesList, refreshData }: { expensesList: ExpenseListItem[], refreshData: () => void }) {

  const deleteExpense = async (expense: ExpenseListItem) => {
    const result = await db.delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast('Expense Deleted!')
      refreshData();
    }
  }

  return (
    <div className='mt-3'>
      <h2 className='font-bold text-lg'>Latest Expenses</h2>

      <div className='grid grid-cols-4 text-center bg-slate-200 p-2 mt-3'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>
      {expensesList.map((expense, index) => (
        <div key={index} className='grid grid-cols-4 items-center p-2 text-center'>
          <h2>{expense.name}</h2>
          <h2>${expense.amount}</h2>
          <h2>{expense.createdAt}</h2>
          <h2 className='flex justify-center items-center'>
            <Trash className='text-red-600 cursor-pointer'
              onClick={() => deleteExpense(expense)}
            />
          </h2>
        </div>
      ))}
    </div>
  )
}

export default ExpenseListTable