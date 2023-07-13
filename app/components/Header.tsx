'use client';

import Image from 'next/image';
import Link from 'next/link';
import reviewImg from '../images/review.png';
import learningImg from '../images/learning.png';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b w-full absolute h-24">
      <nav className="flex items-center justify-between h-full px-8 bg-stone-100">
        <div className="flex items-center flex-shrink-0 text-white mr-6 w-1/4">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
        </div>
        <div className="w-2/4 block flex-grow flex items-center w-auto h-full">
          <Link
            href="/"
            className={`w-1/4 flex flex-col items-center justify-center h-full ${
              pathname === '/review' || pathname === '/' ? 'bg-white' : ''
            }`}
          >
            <Image src={reviewImg} alt="" width={30} height={30} />
            Ôn tập
          </Link>
          <Link
            href="/decks"
            className={`w-1/4 flex flex-col items-center justify-center h-full ${
              pathname === '/decks' ? 'bg-white' : ''
            }`}
          >
            <Image src={learningImg} alt="" width={30} height={30} />
            Học từ mới
          </Link>
          <div className="w-1/4"></div>
        </div>
        <div className="w-1/4 flex justify-end">
          <Link href="/settings">
            <span className="font-bold text-2xl text-yellow-500">Settings</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
