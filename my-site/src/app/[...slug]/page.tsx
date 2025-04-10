// app/[...slug]/page.tsx
import { getMarkdownContent } from "@/lib/getMarkdownContent";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  return [
    { params: { slug: ["about"] } },
    { params: { slug: ["contact"] } },
    { params: { slug: ["beliefs"] } },
    { params: { slug: ["beliefs", "spirits"] } },
  ];
}


interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const slug = params.slug.join("/");

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
