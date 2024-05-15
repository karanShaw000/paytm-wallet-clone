"use server"
import db from "@repo/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth";

export default async function onRamp(provider: string, amount: number) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user?.id) {
        return {
            message: "Unauthorzed User"
        }
    }

    const token = (Math.random() * 1000).toString();
    await db.onRampTransaction.create({
        data: {
            token,
            provider,
            amount,
            userId: Number(session.user?.id),
            status: "Processing",
            startTime: new Date(),
        }
    })

    return {
        message: "Done"
    }
}
