import NextAuth from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../../../models/User'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: (credentials, req) => {
        // database lookup

        let email = credentials.email
        let password = credentials.password

        User.findOne({ email })
            .then( user => {
              if (!user) console.log('No user Found!')
              if (user) console.log(user)
            })
            .catch( err => {
              console.log(err)
            })

      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
    })
  ],
  pages: {
    signIn: '/login',
  },
  jwt: {
    encription: true
  },
  secret: process.env.SECRET,
  callbacks: {
    // async session({ session, token }) {
    //   session.user = token.user;
    //   return session;
    // },
    // async jwt(token, account) {
    //   if(account?.accessToken) {
    //     token.accessToken = account.accessToken
    //   }
    //   return token
    // },
    // redirect: async( url, baseUrl) => {
    //   if( url === '/profile') {
    //     return Promise.resolve('/')
    //   }
    //   return Promise.resolve('/')
    // }
  },
})

// const signinUser = async ({ password, user }) => {
//   if (!user.password) {
//   throw new Error("Please enter password")
//   }
//   const isMatch = await bcrypt.compare(password, user.password)
//   if (!isMatch) {
//   throw new Error("Password Incorrect.");
//   }
//   return user;
//   }