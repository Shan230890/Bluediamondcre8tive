import type { Metadata } from "next";
import { Inter, Quicksand, Poppins } from "next/font/google";
import "./globals.css";

/**
 * Pattern E "Cre8tive Signature" locked font pipeline: Inter is the
 * production body/display font (closest free match to Aptos, which has no
 * licensable webfont distribution). next/font/google handles the
 * font-display: swap self-hosting for us. Font stack in landing-e.css lists
 * "Aptos" first so a visitor with it installed locally still sees it.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/**
 * Quicksand + Poppins are used ONLY for the "blue diamond / CRE8TIVE" logo
 * lockup (see LogoMark.tsx) -- not the body/UI font anywhere else on the
 * site, which stays Inter. Matches the real reference logo: "blue diamond"
 * in Quicksand 500/600, "CRE8TIVE" in Poppins 800.
 */
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blue Diamond Cre8tive — AI-native marketing, tools, and courses",
  description:
    "Blue Diamond Cre8tive is an AI-native digital marketing agency: done-for-you marketing services and a self-serve platform of tools, including the Competitor Intelligence Vault and Cre8tive Score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* No-JS fallback for ScrollReveal — without this, a visitor with
            JS disabled never gets .in added and sections stay invisible. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
