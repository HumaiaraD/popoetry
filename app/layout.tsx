
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, The_Girl_Next_Door } from "next/font/google";
import "./globals.css";
import 'easymde/dist/easymde.min.css';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: "700",
});

const theGirlNextDoor = The_Girl_Next_Door({
  variable: "--font-the-girl-next-door",
  subsets: ["latin"],
  weight: "400",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoPoetry",
  description: "Poems, Poetry, grow, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${theGirlNextDoor.variable} ${dancingScript.variable} antialiased`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
