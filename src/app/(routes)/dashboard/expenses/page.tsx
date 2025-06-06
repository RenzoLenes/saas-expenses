"use client"
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable'
import { ExpenseListItem } from './interfaces/ExpenseListItem';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import { BudgetListItem } from '../budgets/interfaces/BudgetListItem';

function ExpensesPage() {

  const { user } = useUser();
  const [expensesList, setExpensesList] = useState<ExpenseListItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [budgetList, setBudgetList] = useState<BudgetListItem[]>([]);



  useEffect(() => {
    if (user) {
      getBudgetsList();
    }
  }, [user]);



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
    <div className='px-10 pt-5'>
      <ExpenseListTable
        expensesList={expensesList}
        refreshData={() => getBudgetsList()}
      />
    </div>
  )
}

export default ExpensesPage