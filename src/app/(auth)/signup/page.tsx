import { AuroraBackground } from "@/components/ui/aurora-background";
import FormSignup from "./formSignup";

export default function SignupPage() {
  return (
    <main className="w-full h-[50vh] px-2">
      <AuroraBackground>
        <section className="w-full h-full flex justify-center mt-5  xs absolute ">
          <div className="w-[500px] h-[500px] px-4  ">
            <h1 className="text-5xl py-2  font-bold dark:text-white">
              Đăng ký tài khoản
            </h1>
            <FormSignup />
          </div>
        </section>
      </AuroraBackground>
    </main>
  );
}
