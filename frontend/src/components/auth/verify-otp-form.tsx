"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Mail, Key, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import api from "@/services/api"

const verifyOtpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>

interface VerifyOtpFormProps {
  email: string;
  className?: string;
}

export function VerifyOtpForm({ email, className }: VerifyOtpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const form = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = async (data: VerifyOtpFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await api.post('/verify-otp', {
        email: email,
        otp: data.otp
      })

      setSuccess('OTP verified successfully! Redirecting to registration page...')
      
      // Redirect to registration page with email and verified status
      setTimeout(() => {
        router.push(`/auth/register?email=${encodeURIComponent(email)}&verified=true`)
      }, 1500)

    } catch (err: any) {
      console.error('OTP verification error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to verify OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await api.post('/send-otp', { email })

      setSuccess('OTP berhasil dikirim! Silahkan cek Email anda.')

    } catch (err: any) {
      console.error('OTP resend error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verifikasi OTP</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Masukkan kode OTP yang dikirim ke {email}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode OTP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="Masukkan 6 digit OTP"
                      className="pl-10 text-center text-lg tracking-widest"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi OTP"
            )}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full cursor-pointer" 
            onClick={handleResendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim Ulang...
              </>
            ) : (
              "Kirim Ulang OTP"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <a href="/auth/register-validation" className="underline underline-offset-4">
          Kembali ke halaman awal
        </a>
      </div>
    </div>
  )
}
