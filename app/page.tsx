import Link from "next/link";
import Card from "@/components/ui/Card";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          아이온2 정보 사이트
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          아이온2 게임의 다양한 정보를 확인하세요
        </p>

        {/* 검색 바 */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar placeholder="캐릭터명, 아이템명 등을 검색하세요..." />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link href="/characters">
          <Card hover>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">캐릭터 정보</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  캐릭터별 상세 정보와 스탯을 확인하세요
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/items">
          <Card hover>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">아이템 정보</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  다양한 아이템 정보를 검색하고 확인하세요
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/guides">
          <Card hover>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">게임 가이드</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  게임 플레이 가이드와 팁을 확인하세요
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

