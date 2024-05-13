import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <div className='flex justify-between items-center w-full p-4'>
            <h1 className='font-semibold text-xl tracking-wider text-gray-500'>

                URL-Shortner
            </h1>

        </div>

    )
}

export default Navbar