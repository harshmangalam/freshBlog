/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import Layout from "components/Layout.tsx";
import BlogPost from "components/BlogPost.tsx";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
// export const handler: Handlers = {
//   async GET(req, ctx) {
//     const BLOG_DIR = "content/blog";
//     for await (let dir of Deno.readDir(BLOG_DIR)) {
//       const decoder = new TextDecoder("utf-8");
//       const markdown = decoder.decode(await Deno.readFile(filename));
//       const markup = Marked.parse(markdown);
//       console.log(markup.content);
//       console.log(JSON.stringify(markup.meta));
//     }
//     return ctx.render();
//   },
// };
export default function Blog() {
  return (
    <Layout title="Blog">
      <div>
        <section className={tw`grid grid-cols-1 md:grid-cols-3`}>
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
