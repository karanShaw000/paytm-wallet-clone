import { z } from "zod"

export const credentialSchema = z.object({
    phone: z.string().min(10, { message: 'Must be a valid mobile number' }).max(14, { message: 'Must be a valid mobile number' }),
    password: z.string().min(6, { message: "Password Length must be greater than 6" })
})

export type CredentialType = z.infer< typeof credentialSchema >
