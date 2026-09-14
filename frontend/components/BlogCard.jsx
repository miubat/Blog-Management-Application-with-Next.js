import Link from "next/link";
import Avatar from "@/components/Avatar";
import { formatDate } from "@/lib/paginate";

function preview(text, length = 140) {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export default function BlogCard({ blog }) {
  const author = blog.author;

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {blog.category}
        </span>
        <span className="text-xs text-gray-400">{formatDate(blog.createAt)}</span>
      </div>

      <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
        {blog.blogTitle}
      </h2>
      <p className="mb-4 flex-1 text-sm text-gray-600">{preview(blog.blog)}</p>

      <div className="mb-4 flex items-center gap-2">
        <Avatar user={author} />
        <span className="text-sm text-gray-700">
          {author ? `${author.firstname} ${author.lastname}` : "Unknown author"}
        </span>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="mt-auto inline-flex w-full items-center justify-center rounded border border-blue-600 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Read More
      </Link>
    </article>
  );
}
