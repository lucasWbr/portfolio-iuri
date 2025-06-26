import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full header-custom border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav>
          <Link
            href="/bio"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Bio
          </Link>
        </nav>
      </div>
    </header>
  );
}
