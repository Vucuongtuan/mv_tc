import { profile } from "console";
import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      profile(profile) {
        fetch("http://localhost:4000/auth/facebook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log("User data sent to backend:", data))
          .catch((error) => console.error("Error sending user data:", error));
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
        };
      },
    }),
  ],
  
  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  cookies: {
    sessionToken: {
      name: "token",
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/check";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
