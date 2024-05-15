import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";
export async function GET() {
    const session = await getServerSession(authOptions);
    if(session?.user) {
        return NextResponse.json({
            user: session.user
        })
    }
  return NextResponse.json({
    message: "You are not Logged In",
  }, {  status: 403 } );
}
