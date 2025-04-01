import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav style={{ backgroundColor: "#265b4e" }} className="p-4">
          <div className="container mx-auto">
            <h1 className="text-white text-xl font-bold">Solace Advocates</h1>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
