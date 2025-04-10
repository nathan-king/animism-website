// src/app/page.tsx (or wherever your home page is)

import Link from "next/link";
import { getMarkdownLinks } from "@/lib/getMarkdownLinks";
import { getMarkdownContent } from "@/lib/getMarkdownContent";
import ReactMarkdown from "react-markdown";

export default async function HomePage() {
  const links = await getMarkdownLinks();
  const { content } = await getMarkdownContent("home"); // Fetch content from Home.md

  return (
    <main className="pageContent">
      <ReactMarkdown>{content}</ReactMarkdown>
      <ul>
        {links.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}