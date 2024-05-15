import type { DefaultSession, Session } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            id: string;
        };
    }
}
import db from "@repo/db";
import { AuthOptions } from "next-auth";
import CrendentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { credentialSchema } from "@repo/common"
export const authOptions: AuthOptions = {
    providers: [
        CrendentialsProvider({
            name: "Credentials",
            credentials: {
                phone: {
                    label: "Phone Number",
                    type: "text",
                    placeholder: "Enter Your Phone Number",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                //Zod Validation
                const validatedCredentials = credentialSchema.safeParse(credentials);
                if (validatedCredentials.success) {

                    const hashedPassword = await bcrypt.hash(validatedCredentials.data.password, 10);

                    const existingUser = await db.user.findFirst({
                        where: {
                            number: credentials?.phone,
                        },
                    });
                    if (existingUser) {
                        console.log("user is existed", existingUser)
                        console.log("password from user", validatedCredentials.data.password)
                        const passwordValidation = await bcrypt.compare(
                            validatedCredentials.data.password,
                            existingUser.password
                        );
                        console.log("passwordValidation", passwordValidation)

                        if (passwordValidation) {
                            return {
                                id: existingUser.id.toString(),
                                name: existingUser.name,
                                email: existingUser.number,
                            };
                        }
                        return null;
                    }
                    try {
                        const user = await db.user.create({
                            data: {
                                number: validatedCredentials.data.phone,
                                password: hashedPassword,
                            },
                        });

                        return {
                            id: user.id.toString(),
                            name: user.name,
                            number: user.number,
                        };
                    } catch (error) {
                        console.error(error);
                    }
                }
                return null;
            },
        }),
    ],

    secret: process.env.JWT_SECRET,
    callbacks: {

        async session({ token, session }: { token: any, session: Session }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                }
            }
        }
    }
};
