import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center h-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-30 blur-3xl" />
      <div className="relative z-10 flex flex-col justify-center w-full max-w-sm md:max-w-3xl p-4">
        <LoginForm />
      </div>
    </div>
  );
}
