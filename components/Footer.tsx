export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">아이온2 정보</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              아이온2 게임의 다양한 정보를 제공하는 사이트입니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/characters"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  캐릭터 정보
                </a>
              </li>
              <li>
                <a
                  href="/items"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  아이템 정보
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  가이드
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">문의</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              문의사항이 있으시면 연락주세요.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 아이온2 정보. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

