"use client"

import { useSearchParams } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const verified = searchParams.get("verified")

  if (!email || verified !== "true") {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Email</h1>
            <p className="text-gray-600 mb-6">
              Kamu harus memverifikasi emailmu sebelum mengakses formulir pendaftaran.
              Mulai verifikasi emailmu sekarang!
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/auth/register-validation" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Mulai Verifikasi Email
            </a>
            
            <a 
              href="/auth/login" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Kembali ke Login
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Butuh bantuan? Hubungi tim dukungan untuk bantuan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white p-4 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm email={email} />
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