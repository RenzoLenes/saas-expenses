import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'
import Image from 'next/image'

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    return (
        <div className='p-5 shadow-sm border-b'>
            {/* Layout para desktop - justify-end para UserButton a la derecha */}
            <div className="hidden md:flex justify-end">
                <UserButton />
            </div>

            {/* Layout para móvil - elementos distribuidos uniformemente */}
            <div className="md:hidden flex justify-between items-center">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <Image
                    src="/name.png"
                    alt="name"
                    width={70}
                    height={32}
                />

                <Image
                    src="/logo2.svg"
                    alt="name"
                    width={40}
                    height={40}
                />
            </div>
        </div>
    )
}

export default DashboardHeader