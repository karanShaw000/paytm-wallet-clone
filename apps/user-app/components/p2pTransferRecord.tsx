import { Card } from "@repo/ui/card"

export const P2pTransferRecord = ({
    transactions, userId
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        fromUserId: number,
        toUserId: number
    }[],
    userId: number
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transfers">
            <div className="text-center pb-8 pt-8">
                No Recent Transfers
            </div>
        </Card>
    }
    return <Card title="Recent Transfers">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        {
                            t.fromUserId === userId ? "Sent INR" : "Recived INR"
                        }
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    {
                        t.fromUserId === userId ? `- Rs. ${t.amount / 100}` : `+ Rs. ${t.amount / 100}`
                    }
                </div>

            </div>)}
        </div>
    </Card>
}
