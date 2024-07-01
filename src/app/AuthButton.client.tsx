"use client";

import {useSession} from "next-auth/react";

import {signIn, signOut} from "@/auth/helper";
// import { Button } from "@/components/ui/button"
import {Button} from "@nextui-org/react";

export default function AuthButtonClient(){
    const session = useSession();

    return session?.data?.user ? (
        <Button color="success" variant="flat" onClick={async ()=> {
            await signOut();
            await signIn();
        }}>
            {session.data?.user?.name} : Sign Out
        </Button>
    ) : (
        <Button onClick={async ()=> {
            await signIn();
        }}>Sign In</Button>
    )
    
}