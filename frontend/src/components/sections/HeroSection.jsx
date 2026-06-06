

import Image from "next/image";
import NotifyForm from "./NotifyForm";
import { brand } from "@/constants/brand";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__intro">
          <p className="hero__tagline">
            Indian superfoods, reimagined.
          </p>

          <div className="hero__logoWrap">
            <Image
              src="/images/logo/fittfox-logo-mark.webp"
              alt="FITT FOX logo"
              width={741}
              height={697}
              priority
              draggable={false}
              sizes="(max-width: 720px) 78vw, 420px"
              className="hero__logo"
            />
          </div>
        </div>

        <div className="hero__signup">
          <p className="hero__launch">{brand.launchText}</p>

          <div className="hero__divider">
            <span />
            <Image
              src="/images/logo/fittfox-leaf.svg"
              alt=""
              width={28}
              height={28}
              className="hero__dividerLeaf"
            />
            <span />
          </div>

          <p className="hero__description">
            Better-for-you Indian nutrition, coming soon.
          </p>

          <NotifyForm />
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__imageGlow" />

        <Image
          src="/images/hero/hero-products.webp"
          alt="FITT FOX Indian superfoods product range"
          width={1122}
          height={1402}
          priority
          sizes="(max-width: 720px) 100vw, 48vw"
          className="hero__image"
        />
      </div>
    </section>
  );
}
