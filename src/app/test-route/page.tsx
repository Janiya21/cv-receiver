import { auth } from '@/auth'
import React from 'react'
import WhoAmIServerAction from './WhoAmIServerAction';

export default async function TestRoute() {
    const session = await auth();

    async function onGetUserAction(){
        "use server";
        const session = await auth();
        return session?.user?.name ?? null;
    }

  return (
    <main>
        <h2>Test Route</h2>
        <div>User : {session?.user?.name}</div>
        <WhoAmIServerAction onGetUserAction={onGetUserAction}></WhoAmIServerAction>
    </main>
  )
}

