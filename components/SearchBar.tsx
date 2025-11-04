"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  debounceMs?: number;
  className?: string;
  showButton?: boolean;
}

function SearchBarContent({
  placeholder = "검색어를 입력하세요...",
  onSearch,
  debounceMs = 300,
  className,
  showButton = true,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (onSearch) {
        onSearch(value);
      } else {
        // 검색 페이지가 아닐 때는 검색어가 있을 때만 리다이렉트
        // 검색 페이지일 때는 검색어가 없어도 페이지를 유지
        if (pathname === "/search" || value.trim()) {
          const params = new URLSearchParams();
          if (value.trim()) {
            params.set("q", value.trim());
          } else {
            params.delete("q");
          }
          params.set("page", "1");
          router.push(`/search?${params.toString()}`);
        }
      }
    }, debounceMs),
    [onSearch, router, pathname, debounceMs]
  );

  // 초기 마운트 시에는 리다이렉트하지 않도록 수정
  useEffect(() => {
    // 검색어가 변경되었을 때만 실행 (초기 마운트가 아닐 때)
    const currentQuery = searchParams.get("q") || "";
    if (query !== currentQuery) {
      debouncedSearch(query);
    }
  }, [query]); // searchParams와 debouncedSearch 의존성 제거

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // 검색 버튼 클릭 시에만 리다이렉트 (검색어가 있을 때)
      if (query.trim()) {
        const params = new URLSearchParams();
        params.set("q", query.trim());
        params.set("page", "1");
        router.push(`/search?${params.toString()}`);
      } else {
        // 검색어가 없으면 검색 페이지로 이동
        router.push("/search");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                // 검색 페이지가 아닐 때는 초기화만, 검색 페이지일 때는 검색어 제거
                if (pathname === "/search") {
                  router.push("/search");
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {showButton && (
          <Button type="submit">검색</Button>
        )}
      </div>
    </form>
  );
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={
      <div className={props.className}>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          {props.showButton && (
            <div className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          )}
        </div>
      </div>
    }>
      <SearchBarContent {...props} />
    </Suspense>
  );
}

