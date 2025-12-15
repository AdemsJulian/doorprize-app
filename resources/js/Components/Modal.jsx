import React, { useEffect, useMemo, useRef } from "react";
import { HiX } from "react-icons/hi";


export default function Modal({ isOpen, toggle = () => {}, children, title = "", maxW = '2' }) {
    const containerRef = useRef(null)

    const maxWidthClass = useMemo(() => {
        const map = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2': 'max-w-2xl',
            '3': 'max-w-3xl',
            '4': 'max-w-4xl',
            '5': 'max-w-5xl',
            '6': 'max-w-6xl',
            '7': 'max-w-7xl',
            full: 'max-w-full',
        }
        return map[maxW] ?? map['2']
    }, [maxW])

    useEffect(() => {
        if (isOpen && containerRef.current) {
            containerRef.current.scrollTop = 0
        }
    }, [isOpen])

    return (
        <div
            ref={containerRef}
            className={`${isOpen ? "" : "hidden "} fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-900/50 dark:bg-gray-900/90`}
        >
            <div className="flex min-h-screen items-start justify-center p-4">
                <div className={`relative w-full ${maxWidthClass} my-6`}>
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 text-base dark:text-gray-400 max-h-[calc(100vh-3rem)] overflow-hidden">
                        <div className="sticky top-0 z-10 flex items-start justify-between rounded-t dark:border-gray-600 p-2 bg-white dark:bg-gray-700">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white py-2 pl-2">{title}</h3>
                            <button
                                aria-label="Close"
                                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                type="button"
                                onClick={toggle}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-4 pb-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
