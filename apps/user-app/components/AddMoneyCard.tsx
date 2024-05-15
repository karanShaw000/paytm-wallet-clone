"use client"

import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { Select } from "@repo/ui/Select"
import { TextInput } from "@repo/ui/TextInput"
import { useState } from "react"
import onRamp from "../actions/onRamp"


const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoneyCard = () => {

    const [amt, setAmt] = useState(0)
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "")
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    return (
        <Card title="Add Money">

            <div className="w-full">
                <TextInput label="Amount" placeholder="Amount" onChange={(amt) => { setAmt(Number(amt)) }} />
                <div className="py-4 text-left">Bank</div>
                <Select onSelect={(value) => {
                    setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                    setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
                }}

                    options={SUPPORTED_BANKS.map(x => ({
                        key: x.name,
                        value: x.name
                    }))}
                />

                <div className="flex justify-center pt-4">

                    <Button onClick={async () => {

                        await onRamp(provider, amt * 100)
                        window.location.href = redirectUrl || ""
                    }}>
                        Add Money
                    </Button>
                </div>

            </div>

        </Card>


    )
}