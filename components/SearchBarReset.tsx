"use client"

import Link from "next/link";
import {X} from "lucide-react";

const SearchBarReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;

        if(form) form.reset();
    }

    return (
        <button type="reset" onClick={reset}>
            <Link href="/" className="bg-white text-black">
                <X className="size-5" color="black" />
            </Link>
        </button>
    )
}
export default SearchBarReset;