'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SideNavProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

function SideNav({ isMobileMenuOpen, setIsMobileMenuOpen }: SideNavProps) {
    const isMobile=false
    const [isHovered, setIsHovered] = useState(false)

    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        }
    ]

    const currentPath = usePathname()
    const { user } = useUser()

    useEffect(() => {
        console.log('searchParam', currentPath)
    }, [currentPath])

    const toggleSidebar = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovered(true)
        }
    }

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false)
        }
    }

    // Determinar si el sidebar debe estar expandido
    const isExpanded = isMobileMenuOpen || isHovered || isMobile

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border"
            >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-sidebar-foreground z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:static top-0 left-0 h-dvh bg-white border-r border-gray-200 shadow-sm z-50
                    transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen
                        ? 'w-64 translate-x-0'
                        : isMobile
                            ? 'w-0 -translate-x-full'
                            : isHovered
                                ? 'w-64'
                                : 'w-16'
                    }
                `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div>
                        <div className="flex items-center p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/logo2.svg"
                                        alt="logo"
                                        width={32}
                                        height={32}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className={`
                                    overflow-hidden transition-all duration-300
                                    ${isExpanded
                                        ? 'w-auto opacity-100'
                                        : 'w-0 opacity-0'
                                    }
                                `}>
                                    <Image
                                        src="/name.png"
                                        alt="name"
                                        width={70}
                                        height={32}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="mt-8 px-3">
                            <ul className="space-y-2">
                                {menuList.map((menu) => (
                                    <li key={menu.id}>
                                        <Link href={menu.path}>
                                            <div className={`
                                                group/item relative flex items-center px-3 py-2.5 rounded-lg
                                                text-gray-600 hover:bg-blue-50 hover:text-blue-700
                                                transition-colors duration-200
                                                ${currentPath === menu.path
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : ''
                                                }
                                            `}>
                                                <menu.icon className="h-5 w-5 flex-shrink-0" />

                                                <span className={`
                                                    ml-3 overflow-hidden transition-all duration-300
                                                    ${isExpanded
                                                        ? 'w-auto opacity-100'
                                                        : 'w-0 opacity-0'
                                                    }
                                                `}>
                                                    {menu.name}
                                                </span>

                                                {/* Tooltip for collapsed state */}
                                                {!isMobile && !isExpanded && (
                                                    <span className="
                                                        invisible absolute left-full ml-4 px-2 py-1 
                                                        bg-gray-900 text-white text-xs rounded-md
                                                        group/item-hover:visible
                                                        whitespace-nowrap z-50
                                                    ">
                                                        {menu.name}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* User Section */}
                    <div className="mt-auto border-t border-gray-200 p-3">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="flex-shrink-0">
                                <UserButton />
                            </div>
                            <div className={`
                                overflow-hidden transition-all duration-300
                                ${isExpanded
                                    ? 'w-auto opacity-100'
                                    : 'w-0 opacity-0'
                                }
                            `}>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                        {user?.firstName || user?.fullName || 'User'}
                                    </div>
                                    <div className="text-gray-500 text-xs truncate">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideNav