import "./globals.css";

export const metadata = {
  title: "FITT FOX | Indian Superfoods, Reimagined",
  description:
    "FITT FOX is building better-for-you Indian nutrition made from familiar Indian superfoods.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}