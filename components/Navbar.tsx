import React from "react";
import Link from "next/link";
import { auth, signOut, signIn,} from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";


const Navbar: React.FC = async () => {

    const session = await auth();

    return (
        <>
            <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
                <nav className="flex justify-between itmes-center">
                    <Link href="/" ><h2 className="font-serif font-bold text-2xl">PoPoetry</h2>
                    </Link>

                    <div className="flex items-center gap-5">
                        {session && session?.user ? (
                            <>
                                <Link href="/postals/create">
                                    <span className="max-sm:hidden">Create</span>
                                    <BadgePlus className="ml-1" size={14} />
                                </Link>

                                <form action={async () => {
                                    "use server";
                                    await signOut();
                                }}>
                                    <button type="submit" className="max-sm:hidden">
                                        Logout
                                    </button>
                                    <LogOut className="flex flex-row" size={14} />
                                </form>

                                <Link href={`/user/${session?.id}`}>
                                    <Avatar className=" rounded-full overflow-hidden">
                                        <AvatarImage width={40} height={40}
                                         src={session?.user?.image || undefined} 
                                         alt={session?.user?.name || "User Avatar"}
                                          />
                                    </Avatar>
                                </Link>
                            </>
                        ) : (
                            <form action={async () => {
                                "use server";
                                await signIn("github");
                            }}>
                                <button type="submit">Login</button>
                            </form>
                        )}
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar;