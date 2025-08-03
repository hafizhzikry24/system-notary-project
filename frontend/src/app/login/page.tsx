import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-white p-4 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative h-svh bg-white hidden lg:block">
        <div className="w-full h-full flex flex-col items-center justify-center text-center font-bold">
          <div className="w-full text-7xl font-serif">E-Commerce</div>
          <div className="w-full text-7xl font-serif">System</div>
        </div>
      </div>
    </div>
  );
}
