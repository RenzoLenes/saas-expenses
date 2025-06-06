"use client"
import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/db/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation'


function DashboardLayout({ children }: { children: React.ReactNode }) {

    const { user } = useUser();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

    useEffect(() => {
        if (user) {
            checkUserBudgets();
        }
    }, [user])

    const checkUserBudgets = async () => {
        const result = await db.select()
            .from(Budgets)
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress!))

        console.log(result)

        if (result?.length === 0) {
            router.replace('/dashboard/budgets')
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    return (
        <div className="relative min-h-screen">
            <div className={`fixed md:w-64 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block z-50`}>
                <SideNav
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
            </div>

            <div className='md:ml-15'>
                <DashboardHeader
                    onMenuClick={toggleMobileMenu}
                />
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout