import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
import logo from "../imgs/logo.png"
const Navbar = () => {
    return (
        <div className='flex justify-between items-center w-full p-4 md:max-w-6xl'>
            <Link to={'/'} className='font-semibold flex gap-2 items-end text-xl tracking-wider text-gray-500'>

                UrlWee
                <img src={logo} alt="" className="rounded-full h-10 w-10 border-4" />
            </Link>
            <div className="flex gap-4 items-center">

                <ModeToggle />
                <DropdownMenu >
                    <DropdownMenuTrigger ><Avatar >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link to={'/dashboard'}>Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:!bg-red-600 hover:!text-white">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>

    )
}

export default Navbar