import Link from 'next/link';
import Image from 'next/image';
const Header = () => {
  return (
    <header className="sticky top-0 border-b z-10 bg-white">
      <div className="max-w-4xl mx-auto flex justify-between items-center h-12">
        <Link href="/" className="ml-6">
          <Image src={"/home.svg"} width={45} height={45} />
        </Link>
        <ul className="flex">
          <li>
            <a href="https://misskey.io/@muf" target="_blank">
              <Image src={"/misskey.png"} width={45} height={45} className="block p-2"/>
            </a>
          </li>
          <li>
            <a href="https://github.com/muffin1000" target="_blank">
              <Image src={"/github.svg"} width={45} height={45} className="block p-2"/>
            </a>
          </li>
          <li>

          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;