"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NavigationItem = {
  slug: string;
  title: string;
  children?: NavigationItem[];
};

const contentDir = path.join(process.cwd(), "content");

async function walk(dir: string, baseSlug = ""): Promise<NavigationItem[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const items = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      // Build a relative slug (using forward slashes)
      const relativeSlug = path.join(baseSlug, entry.name).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        const indexPath = path.join(entryPath, "index.md");
        let title = entry.name;

        try {
          // Read index.md for the directory title if it exists
          const indexContent = await fs.readFile(indexPath, "utf-8");
          const { data } = matter(indexContent);
          title = data.title || title;
        } catch {
          // If no index.md is present, keep the folder name as the title.
        }

        // Walk inside the directory.
        const children = await walk(entryPath, path.join(baseSlug, entry.name));

        return {
          slug: relativeSlug, // e.g. "beliefs"
          title,
          // Adjust children slugs to be relative.
          children: children.map((child) => ({
            ...child,
            slug: child.slug.replace(`${relativeSlug}/`, ""), // e.g. "spirits" instead of "beliefs/spirits"
          })),
        };
      }

      // Process only non-index markdown files (and skip "home.md")
      if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "home.md" &&
        entry.name !== "index.md"
      ) {
        const fileContent = await fs.readFile(entryPath, "utf-8");
        const { data } = matter(fileContent);
        const title = data.title || entry.name.replace(/\.md$/, "");

        let slug = relativeSlug.replace(/\.md$/, "");
        // Remove trailing "/index" if present
        if (slug.endsWith("/index")) {
          slug = slug.replace(/\/index$/, "");
        }

        return { slug, title };
      }

      return null;
    })
  );

  return items.flat().filter(Boolean) as NavigationItem[];
}

export async function getMarkdownLinks(): Promise<NavigationItem[]> {
  return walk(contentDir);
}
