import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/icone-site.png"
              alt="Logo Admin"
              width={32}
              height={32}
              placeholder="empty"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900 hidden sm:block">
              Admin
            </span>
          </Link>
        </div>

        {/* Right side - Navigation and User */}
        <div className="flex items-center gap-4">
          {/* Back to site */}
          <Link href="/">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Home className="h-4 w-4 mr-2" />
              Ver Site
            </Button>
          </Link>

          {/* User button */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
