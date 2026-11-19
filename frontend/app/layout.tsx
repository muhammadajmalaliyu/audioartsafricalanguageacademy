import "./globals.css";
import { Sora, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/serverApi";

const display = Sora({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://audioartsafricalanguageacademy.vercel.app"),
  title: "Audio Arts Africa Language Academy",
  description: "Learn a Language. Connect with a People. Learn Nigerian languages (Hausa, Yorùbá and Igbo) with native-voice lessons.",
  openGraph: { title: "Audio Arts Africa Language Academy", description: "Learn a Language. Connect with a People.", siteName: "Audio Arts Africa Language Academy", type: "website" },
  twitter: { card: "summary_large_image", title: "Audio Arts Africa Language Academy", description: "Learn a Language. Connect with a People." },
};
const ORG = {
  "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Audio Arts Africa Language Academy", url: SITE, logo: `${SITE}/logo.png`,
  description: "A free platform for learning Nigerian languages (Hausa, Yorùbá and Igbo) with native-speaker audio lessons.",
  slogan: "Learn a Language. Connect with a People.", email: "audioartsafrica@gmail.com",
  contactPoint: { "@type": "ContactPoint", telephone: "+2348029609876", email: "audioartsafrica@gmail.com", contactType: "customer support", availableLanguage: ["English", "Hausa", "Yoruba", "Igbo"] },
  parentOrganization: { "@type": "Organization", name: "Audio Arts Africa" },
};
const SITE_LD = { "@context": "https://schema.org", "@type": "WebSite", name: "Audio Arts Africa Language Academy", url: SITE };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className={`${display.variable} ${body.variable} font-sans`}>
      <JsonLd data={[ORG, SITE_LD]} />
      <AuthProvider><Nav /><main className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">{children}</main><Footer /></AuthProvider>
    </body></html>
  );
}
