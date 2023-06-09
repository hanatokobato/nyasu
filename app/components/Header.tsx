import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white border-b w-full absolute">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span className="font-semibold text-xl tracking-tight">Nyasu</span>
        </div>
        <div className="w-full block flex-grow flex items-center w-auto">
          <div className="text-sm flex-grow">
            <Link
              href="/settings"
              className="block inline-block mt-0 mr-4"
            >
              Settings
            </Link>
            <Link href="/decks" className="block inline-block mt-0 mr-4">
              Decks
            </Link>
          </div>
          <div>
            <a
              href="#"
              className="inline-block text-sm px-4 py-2 leading-none border rounded hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Download
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
