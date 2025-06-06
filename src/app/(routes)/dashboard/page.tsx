"use client"
import { useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo';
import { useEffect, useState } from 'react';
import { BudgetListItem } from './budgets/interfaces/BudgetListItem';
import { db } from '@/utils/dbConfig';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/db/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import { ExpenseListItem } from './expenses/interfaces/ExpenseListItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

function Dashboard() {

  const { user } = useUser();

  const [budgetList, setBudgetList] = useState<BudgetListItem[]>([]);
  const [expensesList, setExpensesList] = useState<ExpenseListItem[]>([]);

  useEffect(() => {
    if (user) {
      getBudgetsList()
    }
  }, [user]);

  /* Use to get budget list */
  const getBudgetsList = async () => {

    const result = await db.select({
      ...getTableColumns(Budgets),
      amount: Budgets.amount,
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress!))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id))

    const results = result.map(budget => ({
      ...budget,
      amount: Number(budget.amount),
    }))
    setBudgetList(results);
    getAllExpenses();
  }

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
      budgetId: Expenses.budgetId,
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress!))
      .orderBy(desc(Expenses.id));

    const results = result.map(expense => ({
      ...expense,
      amount: Number(expense.amount),
    }));

    setExpensesList(results);
  }

  return (

    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.firstName} ✌️ </h2>
      <p className='text-gray-500'>Here&apos;s what happening with your money, Let&apos;s manage your expenses</p>
      <CardInfo budgetList={budgetList} />

      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='col-span-2'>
          <BarChartDashboard
            budgetList={budgetList}
          />


          <div className='border rounded-lg p-5 mt-5'>
            <ExpenseListTable
              expensesList={expensesList}
              refreshData={() => getBudgetsList()}
            />
          </div>

        </div>

        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>

          {budgetList?.length > 0 ? budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          )) : [1, 2, 3].map((item, index) => (
            <div key={index} className='w-full bg-slate-200 rounded-lg
                    h-[150px] animate-pulse'>

            </div>
          ))
          }
        </div>
      </div>


    </div>

  )
}

export default Dashboard