// import { brand } from "@/constants/brand";

// export default function Footer() {
//   return (
//     <footer className="footer">
//       <p>{brand.followText}</p>

//       <div className="footer__links">
//         <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
//           Instagram
//         </a>
//         <a href={brand.linkedinUrl} target="_blank" rel="noreferrer">
//           LinkedIn
//         </a>
//       </div>
//     </footer>
//   );
// }

import { brand } from "@/constants/brand";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h4v11H4z" />
      <path d="M6 4.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2z" />
      <path d="M10 9h3.8v1.5c.6-.9 1.7-1.8 3.5-1.8 3 0 4.7 2 4.7 5.5V20h-4v-5.2c0-1.5-.6-2.4-1.9-2.4-1.4 0-2.1 1-2.1 2.5V20h-4z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <p>{brand.followText}</p>

      <div className="footer__links">
        <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
          <InstagramIcon />
          <span>Instagram</span>
        </a>

        <a href={brand.linkedinUrl} target="_blank" rel="noreferrer">
          <LinkedinIcon />
          <span>LinkedIn</span>
        </a>
      </div>
    </footer>
  );
}