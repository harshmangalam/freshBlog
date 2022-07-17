/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Post } from "types/blog.ts";
import Tag from "./Tag.tsx";

export default function BlogPost({
  description,
  postedAt,
  poster,
  tags,
  title,
  slug,
}: Post) {
  return (
    <article className={tw`border shadow rounded-lg`}>
      <img
        src={poster}
        alt={"Poster image"}
        className={tw`aspect-square object-fit w-full h-60 rounded-t-lg`}
      />
      <div className={tw`p-4`}>
        <a
          href={`/${slug}`}
          className={tw`hover:text-blue-400 text-xl font-medium`}
        >
          {title}
        </a>
        <p className={tw`mt-2 text-gray-500`}>{postedAt}</p>

        <p className={tw`text-lg text-gray-600 mt-2`}>{description}</p>

        <div className={tw`mt-4 flex flex-wrap gap-4`}>
          {tags.map((tag) => (
            <Tag title={tag} key={tag} />
          ))}
        </div>
      </div>
    </article>
  );
}
