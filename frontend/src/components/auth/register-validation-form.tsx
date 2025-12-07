"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import api from "@/services/api"

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type RegisterValidationFormData = z.infer<typeof registerSchema>

interface RegisterValidationFormProps {
  className?: string;
}

export function RegisterValidationForm({ className }: RegisterValidationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const form = useForm<RegisterValidationFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: RegisterValidationFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await api.post('/send-otp', data)

      setSuccess('OTP berhasil dikirim! mengalihkan ke halaman verifikasi OTP...')
      
      // Redirect to OTP verification page with email as query parameter
      setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`)
      }, 1500)

    } catch (err: any) {
      console.error('OTP sending error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Daftar</h1>
        <p className="text-balance text-sm text-muted-foreground">Masukkan email untuk verifikasi OTP</p>
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Masukkan email"
                      className="pl-10"
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
                Mengirim OTP...
              </>
            ) : (
              "Kirim OTP"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Masuk
        </a>
      </div>
    </div>
  )
} 