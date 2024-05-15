"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import db from "@repo/db"
export default async function(amount: number, to: string) {

    const session = await getServerSession(authOptions);
    const from = session?.user?.id

    if (!from) {
        return {
            message: "Unauthorzed User"
        }
    }

    const toUser = await db.user.findFirst({
        where: {
            number: to
        }
    })

    if (!toUser) {
        return {
            message: "Receiver Number is Invalid"
        }
    }

    await db.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) }
        })

        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficent balance")
        }

        await tx.balance.update({
            where: {
                userId: Number(from)
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })

        await tx.balance.update({
            where: {
                userId: toUser.id
            },
            data: {
                amount: { increment: amount }
            }
        })


        await tx.p2pTransfer.create({
            data: {
                amount: Number(amount),
                fromUserId: fromBalance.userId,
                toUserId: toUser.id,
                timestamp: new Date(),
            }
        })

    })
    return {
        message: "transaction successful"
    }
}

