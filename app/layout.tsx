import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { createMetadata as createMetadataUtil } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = createMetadataUtil({
  title: "아이온2 정보 - 게임 정보 제공 사이트",
  description: "아이온2 게임의 다양한 정보를 제공하는 사이트입니다. 캐릭터 정보, 아이템 정보, 게임 가이드를 확인하세요.",
  keywords: "아이온2, AION2, 게임 정보, 캐릭터, 아이템, 가이드",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

