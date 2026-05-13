import { Box } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(29,78,216,0.05),_transparent_60%)]" />
      </div>
      
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
            <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">AI Hull Lab</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}
