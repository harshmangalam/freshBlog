/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "components/Layout.tsx";
import BlogPost from "components/BlogPost.tsx";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { Post } from "../types/blog.ts";
export const handler: Handlers = {
  async GET(req, ctx) {
    const BLOG_DIR = "blog";
    const posts = [];
    for await (const dir of Deno.readDir(BLOG_DIR)) {
      if (dir.isFile) {
        const decoder = new TextDecoder("utf-8");
        const markdown = decoder.decode(
          await Deno.readFile(`${BLOG_DIR}/${dir.name}`)
        );
        const markup = Marked.parse(markdown);
        posts.push(markup.meta);
      }
    }
    return ctx.render({ posts });
  },
};
export default function Blog({ data }: PageProps) {
  const posts: Post[] = data.posts;
  return (
    <Layout title="Blog">
      <div>
        <section className={tw`grid grid-cols-1 md:grid-cols-2`}>
          {posts.map((post) => (
            <BlogPost key={post.slug} {...post} />
          ))}
        </section>
      </div>
    </Layout>
  );
}

const posts = [
  {
    title: "Lets explore about the event loop in nodejs and javascript",
    poster:
      "https://d33wubrfki0l68.cloudfront.net/3bfd00a5f4b80c67391aa7590e14acf60737f6c0/925de/blog/posts/nestjs-prisma-rest-api.png",
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quia similique fugit magni placeat nam deleniti vel ipsum. Saepe necessitatibus.`,
    readTime: "20 min",
    postedAt: "22 July 2022",
    tags: ["javascript", "nodejs", "event loop"],
    slug: "lets-exlore-about-the-event-loop-in-nodejs-and-javascript",
  },
];
