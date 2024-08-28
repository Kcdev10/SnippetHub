import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import a Prism theme
import "prismjs/components/prism-javascript";
import ReactRedux from "@/components/wrapper/ReactRedux";
import Header from "@/components/header/header";
import TanStackReact from "@/components/wrapper/TanStackReact";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snippet Hub",
  description:
    "Snippet Gallery where you can save you snippet code anytime and get anytime.",
  icons: {
    icon: {
      rel: "icon",
      url: "/favicon.ico",
      sizes: "32x32",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackReact>
          <ReactRedux>
            <Header />
            {children}
          </ReactRedux>
        </TanStackReact>
      </body>
    </html>
  );
}
