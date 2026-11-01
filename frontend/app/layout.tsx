import "./globals.css";
import { Sora, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import Nav from "@/components/Nav";

const display = Sora({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata = {
  title: "Audio Arts Africa Language Academy",
  description: "Learn a Language. Connect with a People. Native-voice African language courses.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className={`${display.variable} ${body.variable} font-sans`}>
      <AuthProvider><Nav /><main className="max-w-6xl mx-auto px-4 py-8">{children}</main></AuthProvider>
    </body></html>
  );
}
