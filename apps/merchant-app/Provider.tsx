"use client";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return(
  
  <RecoilRoot>
      <SessionProvider>
          {children}
      </SessionProvider>
  </RecoilRoot>
  )
}
