import { AuroraBackground } from "@/components/ui/aurora-background";
import FormLogin from "./formLogin";

export default function LoginPage() {
  return (
    <main className="w-full h-[50vh] px-2 ">
      <AuroraBackground>
        <section className="w-full h-full flex justify-center  items-center absolute">
          <div className="w-[500px] h-[500px] px-4  ">
            <h1 className="text-5xl py-2  font-bold dark:text-white">
              Đăng nhập
            </h1>
            <FormLogin />
          </div>
        </section>
      </AuroraBackground>
    </main>
  );
}
