

import Image from "next/image";
import NotifyForm from "./NotifyForm";
import { brand } from "@/constants/brand";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__tagline">
          Indian superfoods,
          <br />
          reimagined.
        </p>

        <div className="hero__logoWrap">
          <Image
            src="/images/logo/fittfox-logo01.png"
            alt="FITT FOX logo"
            width={620}
            height={620}
            priority
            className="hero__logo"
          />
        </div>

        <p className="hero__launch">{brand.launchText}</p>

        <p className="hero__description">
          Better-for-you Indian nutrition, coming soon.
        </p>

        <NotifyForm />

        <div className="hero__divider">
          <span />
          <Image
            src="/images/logo/fittfox-leaf-icon01.png"
            alt="Leaf icon"
            width={18}
            height={18}
            className="hero__dividerLeaf"
          />
          <span />
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__imageGlow" />

        <Image
          src="/images/hero/hero-products.png"
          alt="FITT FOX Indian superfoods product visual"
          width={900}
          height={700}
          priority
          className="hero__image"
        />
      </div>
    </section>
  );
}


