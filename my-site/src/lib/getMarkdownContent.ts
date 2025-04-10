"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export async function getMarkdownContent(slug: string) {
  slug = slug.trim();

  const contentDir = path.resolve(process.cwd(), "content");

  console.log("Working Directory:", process.cwd());
  console.log("Content Directory:", contentDir);
  console.log("Requested slug:", slug);

  const candidatePaths = [
    path.join(contentDir, slug, "index.md"),
    path.join(contentDir, `${slug}.md`),
  ];

  console.log("Candidate paths:", candidatePaths);

  for (const candidate of candidatePaths) {
    try {
      console.log("Checking candidate:", candidate);
      await fs.access(candidate);
      const fileContent = await fs.readFile(candidate, "utf-8");
      const { content, data } = matter(fileContent);
      console.log("Found markdown file at:", candidate);
      return { content, data };
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "ENOENT"
      ) {
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
