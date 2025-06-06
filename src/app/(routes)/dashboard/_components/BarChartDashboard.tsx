"use client"
import React from 'react'
import { BudgetListItem } from '../budgets/interfaces/BudgetListItem'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDashboard({ budgetList }: { budgetList: BudgetListItem[] }) {
  return (

    budgetList.length > 0 ? (
      <div className='border rounded-lg p-5 '>
        <h2 className='font-bold text-lg'>Activity</h2>
        <ResponsiveContainer width={'80%'} height={300} className='mt-5'>
          <BarChart
            data={budgetList}
            margin={{
              top: 7
            }}
          >
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='totalSpend' stackId='a' fill="#008ad8" />
            <Bar dataKey='amount' stackId='a' fill="#008ad85f" />


          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <div className='w-full h-[300px] border rounded-lg p-5 bg-slate-200 animate-pulse '>
      </div>
    )
  )
}

export default BarChartDashboard