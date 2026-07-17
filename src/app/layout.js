import "./globals.css";
import "./original.css";

export const metadata = {
  title: "LWT | Lathey Weigh Trix - Weighing Scales & Solar Installations",
  description: "Lathey Weigh Trix provides top-tier industrial weighbridges, weighing scales calibration, and high-efficiency solar EPC installation services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
          })();
        ` }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
