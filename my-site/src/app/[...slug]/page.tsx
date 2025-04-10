// app/[...slug]/page.tsx
import { getMarkdownContent } from "@/lib/getMarkdownContent";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  // Example static parameters — you can also generate these dynamically by walking your content folder.
  return [
    { slug: ["about"] },
    { slug: ["contact"] },
    { slug: ["beliefs"] },
    { slug: ["beliefs", "spirits"] },
  ];
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  // Await the params to satisfy the Next.js requirement.
  const resolvedParams = await Promise.resolve(params);
  // Now it's safe to use the properties on resolvedParams.
  const slug = resolvedParams.slug.join("/");
  
  const result = await getMarkdownContent(slug);
  
  if (!result) {
    return notFound();
  }
  
  const { content, data } = result;

  return (
    <main className="pageContent">
      <h1>{data.title || slug}</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
