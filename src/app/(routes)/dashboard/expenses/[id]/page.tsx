"use client";
import { Budgets } from '@/db/schema';
import { db } from '@/utils/dbConfig';
import { use, useEffect, useState } from 'react'
import { and, getTableColumns, sql } from 'drizzle-orm';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { BudgetListItem } from '../../budgets/interfaces/BudgetListItem';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import { ExpenseListItem } from '../interfaces/ExpenseListItem';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();

  const [budgetInfo, setBudgetInfo] = useState<BudgetListItem>(
    {} as BudgetListItem
  );
  const [expensesList, setExpensesList] = useState<ExpenseListItem[]>([]);
  const route = useRouter();

  useEffect(() => {

    if(user){
      getBudgetInfo();
    }
  }, [user]);


  const getBudgetInfo = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      amount: Budgets.amount,
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress!),
          eq(Budgets.id, Number(id))
        ))
      .groupBy(Budgets.id)

    const results: BudgetListItem[] = result.map(budget => ({
      ...budget,
      icon: budget.icon || '',
      amount: Number(budget.amount),
    }));
    setBudgetInfo(results[0]);
    getExpensesList();
  }

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .orderBy(Expenses.id)

    const results: ExpenseListItem[] = result.map(expense => ({
      ...expense,
      amount: Number(expense.amount),
    }));

    setExpensesList(results);


  }

  const deleteBudget = async () => {

    const deleteExpenses = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .returning();

    if (deleteExpenses) {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, Number(id)))
        .returning();

      console.log(result);
    }
    toast('Budget Deleted!');

    route.replace('/dashboard/budgets');

  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        <span className='flex gap-2 items-center'>
          <ArrowLeft onClick={() => route.back()} className='cursor-pointer' />
          My Expenses
        </span>

        <div className='flex gap-2 items-center'>
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />


          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2 cursor-pointer' variant='destructive'>
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with expenses
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo ? <BudgetItem
          budget={budgetInfo}
        /> :
          <div className='h-[150px] w-full bg-slate-200
          rounded-lg animate-pulse'>
          </div>
        }
        <AddExpense budgetId={id}
          refreshData={() => getBudgetInfo()} />

      </div>
      <div className='mt-4'>
        <ExpenseListTable refreshData={() => getBudgetInfo()} expensesList={expensesList} />
      </div>
    </div>
  )
}

export default ExpensesScreen