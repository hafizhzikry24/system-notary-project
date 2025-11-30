"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { authService } from "@/services/authService"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await authService.forgotPassword(data.email)
      setSuccess(true)
      // Optional: redirect after a delay
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      console.error('Forgot password error:', err);
      // Handle error response from backend
      if (err.response?.data) {
        const data = err.response.data;
        // Check if the response has success: false (email not found case)
        if (data.success === false && data.message) {
          setError(data.message);
        } else if (data.message) {
          setError(data.message);
        } else if (data.errors) {
          const errors = data.errors;
          const firstError = Object.values(errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
        } else {
          setError("Failed to send reset link. Please try again.");
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Cek Email Anda</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Kami telah mengirimkan link reset password ke {form.getValues('email')}
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Cek email Anda dan klik link untuk reset password. Jika Anda tidak melihat email, cek folder spam.
          </AlertDescription>
        </Alert>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/auth/login")}
        >
          Kembali ke login
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Lupa Password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Masukkan email Anda dan kami akan mengirimkan link reset password
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
                Mengirim...
              </>
            ) : (
              "Kirim Link Reset Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Sudah ingat password?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Masuk
        </a>
      </div>
    </div>
  )
}

