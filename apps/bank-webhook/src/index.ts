import express from "express";
import db from "@repo/db"

const app = express();

app.use(express.json())
app.get("/", (req, res) => {
    return res.json({ message: "Health OK" }).status(200)
})

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //Check if this infromation actually came from hdfc bank with the secret key
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }
    console.log(paymentInformation)

    //Update balance in db, add txn
    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: paymentInformation.userId
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount * 100)
                    }
                }
            }),

            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }

            })

        ])

        res.status(200).json({ message: "captured" })

    } catch (e) {
        console.error(e)
        res.status(411).json({ message: "Error while processing webhooks" })
    }


})


app.listen(3003)
