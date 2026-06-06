

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/constants/brand";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand" aria-label="FITT FOX home">
          <span className="navbar__iconBox">
            <Image
              src="/images/logo/fittfox-leaf-icon01.webp"
              alt="FITT FOX leaf icon"
              width={18}
              height={18}
              className="navbar__leaf"
            />
          </span>
          <span>{brand.name}</span>
        </Link>
      </div>
    </header>
  );
}
