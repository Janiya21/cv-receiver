"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignIn = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { error, callbackUrl } = router.query;

    useEffect(() => {
        // Redirect to the callback URL or home page if already signed in
        if (session) {
            router.push(callbackUrl ? callbackUrl.toString() : "/");
        }
    }, [session, router, callbackUrl]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const { username, password } = event.target as typeof event.target & {
            username: { value: string };
            password: { value: string };
        };

        const result = await signIn('credentials', {
            redirect: false,
            username: username.value,
            password: password.value,
            callbackUrl: callbackUrl ? callbackUrl.toString() : "/"
        });

        if (result?.url) {
            router.push(result.url);
        }
    };

    if (session) {
        return null; // Avoid rendering the form if already signed in
    }

    return (
        <div>
            <h1>Sign In</h1>
            {error && <p style={{ color: 'red' }}>Authentication error</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input name="username" type="text" required />
                </label>
                <label>
                    Password:
                    <input name="password" type="password" required />
                </label>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
