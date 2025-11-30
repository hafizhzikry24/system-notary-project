"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { authService } from "@/services/authService"

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil")
    .regex(/[A-Z]/, "Kata sandi harus mengandung huruf kapital")
    .regex(/[0-9]/, "Kata sandi harus mengandung angka")
    .regex(/[@$!%*?&]/, "Kata sandi harus mengandung karakter khusus (@$!%*?&)"),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Kata sandi tidak cocok",
  path: ["passwordConfirmation"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  className?: string;
}

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [error, setError] = useState("")
  const [tokenError, setTokenError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  })

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError("Tautan reset tidak valid. Token tidak ditemukan.")
        setIsValidatingToken(false)
        return
      }

      try {
        const response = await authService.checkResetToken(token)
        if (!response.success) {
          setTokenError(response.message || "Token tidak valid atau sudah kadaluarsa.")
        }
      } catch (err: any) {
        console.error('Token validation error:', err);
        if (err.response?.data?.message) {
          setTokenError(err.response.data.message);
        } else {
          setTokenError("Token reset tidak valid atau sudah kadaluarsa. Silakan minta tautan reset kata sandi baru.");
        }
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Tautan reset tidak valid. Token tidak ditemukan.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await authService.resetPassword(token, data.password, data.passwordConfirmation)
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Gagal mengatur ulang kata sandi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidatingToken) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground"> Validasi token...</p>
        </div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Tautan Reset Tidak Valid</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {tokenError}
          </p>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Tautan reset kata sandi tidak valid atau sudah kedaluwarsa. Silakan minta tautan reset kata sandi baru.
          </AlertDescription>
        </Alert>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/auth/forgot-password")}
        >
          Minta Tautan Reset Baru
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Berhasil Mengatur Ulang Kata Sandi</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Kata sandi Anda telah berhasil diatur ulang. Mengarahkan ke halaman login...
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Anda sekarang dapat masuk dengan kata sandi baru Anda.
          </AlertDescription>
        </Alert>

        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/auth/login")}
        >
          Masuk Sekarang
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Atur Ulang Kata Sandi</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Masukkan kata sandi baru Anda di bawah ini
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kata Sandi Baru</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi baru"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Kata sandi minimal 8 karakter, termasuk huruf besar, huruf kecil, angka, dan karakter khusus (@$!%*?&)
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...field}
                      type={showPasswordConfirmation ? "text" : "password"}
                      placeholder="Konfirmasi kata sandi baru"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      disabled={isLoading}
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
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
                Mengatur ulang kata sandi...
              </>
            ) : (
              "Atur Ulang Kata Sandi"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

