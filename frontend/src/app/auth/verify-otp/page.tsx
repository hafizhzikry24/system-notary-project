"use client"

import { useSearchParams } from "next/navigation"
import { VerifyOtpForm } from "@/components/auth/verify-otp-form"

export default function VerifyOtpPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  if (!email) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground mt-2">Email parameter is missing. Please start the registration process again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white p-4 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <VerifyOtpForm email={email} />
          </div>
        </div>
      </div>
      <div className="relative h-svh bg-zinc-50 hidden lg:block">
        <div className="w-full h-full flex flex-col items-center justify-center text-center font-bold">
          <div className="w-full text-7xl font-serif">NOIS</div>
          <div className="w-full text-3xl font-serif">Notary Information Systems</div>
        </div>
      </div>
    </div>
  )
}
