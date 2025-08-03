'use client';

import { RegisterForm } from "@/components/register-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-white p-4 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative h-svh hidden bg-muted lg:block">
        <Image
          src="/assets/register.jpg"
          alt="Login background"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  )
} 