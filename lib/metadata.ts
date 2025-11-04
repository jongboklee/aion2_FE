import { Metadata } from "next";

export const createMetadata = (options: {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
}): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aion2-info.vercel.app";
  const fullTitle = options.title.includes("아이온2") 
    ? options.title 
    : `${options.title} - 아이온2 정보`;

  return {
    title: fullTitle,
    description: options.description,
    keywords: options.keywords || "아이온2, AION2, 게임 정보, 캐릭터, 아이템, 가이드",
    openGraph: {
      title: fullTitle,
      description: options.description,
      type: "website",
      url: options.path ? `${baseUrl}${options.path}` : baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
    },
  };
};

