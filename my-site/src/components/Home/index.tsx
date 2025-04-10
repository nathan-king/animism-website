import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default async function HomePage() {
  const homeFilePath = path.join(process.cwd(), "content", "home.md");

  try {
    const homeContent = await fs.readFile(homeFilePath, "utf-8");
    const { content, data } = matter(homeContent);

    const files = await fs.readdir(path.join(process.cwd(), "content"));

    const links = await Promise.all(
      files
        .filter((file) => file !== "home.md") // Exclude Home.md from links
        .map(async (file) => {
          const filePath = path.join(process.cwd(), "content", file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const { data } = matter(fileContent);
          return {
            slug: file.replace(".md", ""),
            title: data.title || file.replace(".md", ""),
          };
        })
    );

    return (
      <main className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <ul className="space-y-2">
          {links.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/${slug}`} className="text-blue-600 underline">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (error) {
    console.error("Error processing Home.md or content files:", error);
    return (
      <main className="p-6 max-w-2xl mx-auto">
        <p>Error loading content.</p>
      </main>
    );
  }
}