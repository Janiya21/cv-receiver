"use client";

import {useSession} from "next-auth/react";

import {signIn, signOut} from "@/auth/helper";
import {Button,Tooltip} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthButtonClient(){
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            console.log('not authenticated');
            router.push(`/auth/signIn?callbackUrl=${encodeURIComponent(window.location.href)}`);
        }else{
            console.log('authenticated');
        }
    }, [session, router]);
    return session?.data?.user ? (
              
        <Tooltip
        content={
          <div className="px-1 py-2">
            <div className="text-small font-bold">User : {session.data?.user?.name}</div>
            <div className="text-tiny">Email : {session.data?.user?.email}</div>
            {/* <div className="text-tiny">Email : {session.data?.user?.id}</div> */}
          </div>
        }
      >
        <Button color="success" variant="flat" onClick={async ()=> {
            await signOut();
            await signIn();
        }}>
            
            {session.data?.user?.name} : Sign Out
        
        </Button>
        </Tooltip>
            ) : (
        <Button onClick={async ()=> {
            await signIn();
        }}>Sign In</Button>
    )
    
}