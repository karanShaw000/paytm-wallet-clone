import { getServerSession } from "next-auth";
import { P2pTransferRecord } from "../../../components/p2pTransferRecord";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../../lib/auth"
import { BalanceCard } from "../../../components/BalanceCard";
import prisma from "@repo/db"

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}
async function getP2pTransfers() {
    const session = await getServerSession(authOptions);
    console.log(session)
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                {
                    fromUserId: Number(session?.user?.id)
                },
                {
                    toUserId: Number(session?.user?.id)
                }
            ]
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId: t.toUserId
    }))
}

export default async function() {
    const balance = await getBalance()
    const userP2pTransfers = await getP2pTransfers()
    const session = await getServerSession(authOptions)
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <P2pTransferRecord transactions={userP2pTransfers} userId={Number(session?.user?.id)} />
                </div>
            </div>
        </div>
    </div>
}
