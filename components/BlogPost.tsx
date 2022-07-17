/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";

interface BlogPostProps {
  slug: string;
  title: string;
  poster: string;
  description: string;
  readTime: string;
  postedAt: string;
  tags: string[];
}

export default function BlogPost({
  description,
  postedAt,
  poster,
  readTime,
  tags,
  title,
  slug,
}: BlogPostProps) {
  return (
    <article className={tw`border shadow rounded-lg`}>
      <img
        src={poster}
        alt={"Poster image"}
        className={tw`aspect-square object-fit w-full h-60 rounded-t-lg`}
      />
      <div className={tw`p-4`}>
        <a href="/" className={tw`hover:text-blue-400 text-xl font-medium`}>{title}</a>
        <p className={tw`mt-2 text-gray-500 flex space-x-2`}>
          <span>{postedAt}</span>
          <span>&bull;</span>
          <span> {readTime}</span>
        </p>

        <p className={tw`text-lg text-gray-600 mt-2`}>{description}</p>
      </div>
    </article>
  );
}
