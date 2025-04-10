"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export async function getMarkdownContent(slug: string) {
  // NOTE: We are no longer converting the slug to lowercase.
  // This preserves the exact casing from the URL.
  slug = slug.trim();

  const contentDir = path.resolve(process.cwd(), "content");

  console.log("Working Directory:", process.cwd());
  console.log("Content Directory:", contentDir);
  console.log("Requested slug:", slug);

  // Build candidate paths: first try the index file, then a direct file.
  const candidatePaths = [
    path.join(contentDir, slug, "index.md"),    // e.g. /content/beliefs/spirits/index.md
    path.join(contentDir, `${slug}.md`),          // e.g. /content/beliefs/spirits.md
  ];

  console.log("Candidate paths:", candidatePaths);

  for (const candidate of candidatePaths) {
    try {
      console.log("Checking candidate:", candidate);
      await fs.access(candidate);  // Throws if file doesn't exist
      const fileContent = await fs.readFile(candidate, "utf-8");
      const { content, data } = matter(fileContent);
      console.log("Found markdown file at:", candidate);
      return { content, data };
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.warn("Candidate not found:", candidate);
      } else {
        console.error("Error accessing candidate:", candidate, err);
        throw err;
      }
    }
  }

  console.error("No markdown file found for slug:", slug);
  return null;
}
