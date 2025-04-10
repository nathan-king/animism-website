import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { getMarkdownLinks } from "@/lib/getMarkdownLinks";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = await getMarkdownLinks(); // ✅ use this instead of getMarkdownNavigation

  return (
    <html lang="en">
      <body>
        <Navbar links={links} />
        <main className="pageContent">{children}</main>
      </body>
    </html>
  );
}
