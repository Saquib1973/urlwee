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
import { useAuth } from "@/common/AuthContext"


const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <div className='flex justify-between items-center w-full p-4 md:max-w-6xl'>
            <Link to={'/'} className='font-semibold flex gap-2 items-end text-xl tracking-wider text-gray-500'>
                UrlWee
                <img src={logo} alt="" className="rounded-full h-10 w-10 border-4" />
            </Link>
            <div className="flex gap-4 items-center">

                <ModeToggle />
                <DropdownMenu >
                    <DropdownMenuTrigger >
                        {
                            !(user == null || !user) ? <>
                                <Avatar >
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </> :
                                <div className="p-2 outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                    </svg>
                                </div>
                        }

                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {user == null || !user ? <>
                            {/* <DropdownMenuLabel></DropdownMenuLabel> */}
                            {/* <DropdownMenuSeparator /> */}
                            <DropdownMenuItem><Link to={'/login'}>Login</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to={'/signup'}>Register</Link></DropdownMenuItem>
                        </> : <><DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link to={'/dashboard'}>Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem className="hover:!bg-red-600 hover:!text-white">
                                <button onClick={logout}>Logout</button>
                            </DropdownMenuItem></>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>

    )
}

export default Navbar