import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Could not connect to MongoDB');
  }
}

export default dbConnect;





// import NextAuth, {User, NextAuthConfig} from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import CredentialsProvider from "next-auth/providers/credentials";
// import AzureADProvider from "next-auth/providers/azure-ad";
// import GoogleProvider from "next-auth/providers/google";

// export const BASE_PATH = "/api/auth";

// const authOptions: NextAuthConfig = {
//     providers:[
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//               username: {
//                 label: "Username",
//                 type: "text",
//                 placeholder: "Enter username",
//               },
//               password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//               // Validate credentials with your database here
//               const user = {
//                 id: "1",
//                 name: "Admin",
//                 email: "admin@example.com",
//                 image: "https://avatars.githubusercontent.com/u/80968727?v=4",
//                 username: "admin",
//                 password: "admin",
//               };
      
//               if (
//                 credentials?.username == user.username &&
//                 credentials.password == user.password
//               ) {
//                 return user;
//               } else {
//                 return null;
//               }
//             },
//           }),
//           AzureADProvider({
//             clientId: process.env.AZURE_AD_CLIENT_ID,
//             clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
//             tenantId: process.env.AZURE_AD_TENANT_ID,
//           }),
//           GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET
//           }),
//         // Credentials({
//         //     name: 'Credentials',
//         //     credentials: {
//         //         username: {label: "Username", type: "text", placeholder:"jsmith"},
//         //         password: {label: "Username", type: "password"}
//         //     },
//         //     async authorize(credentials): Promise<User | null>{
//         //         const users = [
//         //             {
//         //                 id: "test-user-1",
//         //                 userName: "Janiya",
//         //                 name: "Janith",
//         //                 password: "1212",
//         //                 email: "janithsandaru999@gmail.com",
//         //             },
//         //             {
//         //                 id: "test-user-1",
//         //                 userName: "Janiya",
//         //                 name: "Janith",
//         //                 password: "1212",
//         //                 email: "janithsandaru999@gmail.com",
//         //             },
//         //             {
//         //                 id: "test-user-2",
//         //                 userName: "Janiya",
//         //                 name: "Janith",
//         //                 password: "1212",
//         //                 email: "janithsandaru999@gmail.com",
//         //             },
//         //         ]
//         //         const user = users.find(
//         //             (user) => user.userName === credentials.username && user.password === credentials.password
//         //         );
//         //         return user? {id: user.id, name: user.name, email:user.email} : null;
//         //     }
//         // })
//     ],
//     basePath: BASE_PATH,
//     secret: process.env.EXTAUTH_SECRET,
//     // pages: {
//     //     signIn: "/signin",
//     //   }
// }

// export const {handlers, auth, signIn, signOut} = NextAuth(authOptions);