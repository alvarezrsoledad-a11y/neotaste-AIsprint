import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeoTaste",
  description: "Social discovery layer for food & restaurant deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function (m, a, z, e) {
  var s, t, u, v;
  try { t = m.sessionStorage.getItem('maze-us'); } catch (err) {}
  if (!t) { t = new Date().getTime(); try { m.sessionStorage.setItem('maze-us', t); } catch (err) {} }
  u = document.currentScript || (function () { var w = document.getElementsByTagName('script'); return w[w.length - 1]; })();
  v = u && u.nonce;
  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'b99537ca-0d05-4cff-a65a-6aad22da961e');` }} />
      </head>
      <body>
        <div className="mobile-frame">{children}</div>
      </body>
    </html>
  );
}
