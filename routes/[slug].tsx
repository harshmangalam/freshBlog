/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "components/Layout.tsx";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { PostDetail } from "types/blog.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const BLOG_DIR = "blog";
    const slug = ctx.params.slug;

    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(
      await Deno.readFile(`${BLOG_DIR}/${slug}.md`)
    );
    const markup = Marked.parse(markdown);

    return ctx.render({ post: { ...markup.meta, content: markup.content } });
  },
};

export default function Blog({ data }: PageProps) {
  const post: PostDetail = data.post;
  return (
    <Layout title={post.title}>
      <div>
        <img
          src={post.poster}
          alt="Post cover image"
          className={tw`rounded-lg`}
        />
        <h2 className={tw`font-medium text-3xl mt-4`}>{post.title}</h2>
        <p className={tw`mt-2 text-gray-600 text-lg`}>{post.postedAt}</p>
        <div className={tw`mt-4 flex flex-wrap gap-4`}>
          {post.tags.map((tag) => (
            <p
              className={tw`text-sm rounded-full px-3 py-1 border text-gray-600 uppercase`}
            >
              {tag}
            </p>
          ))}
        </div>
        <div
          className={tw`mt-8 prose lg:prose-xl`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </Layout>
  );
}
