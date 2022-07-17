/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import ThemeSwitcher from "islands/ThemeSwitcher.tsx";

interface LayoutProps {
  title: string;
  children: ComponentChildren;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div class={tw`min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100`}>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="index.css" />
        <meta
          name="description"
          content="Fullstack blog web app build with deno fresh"
        />
        <link rel="manifest" href="site.webmanifest" />
        
      </Head>
      {/* navbar  */}
      <nav
        className={tw`flex justify-between items-center max-w-5xl py-8 mx-auto px-4`}
      >
        <a href="/">
          <h1 className={tw`text-3xl font-medium`}>Fresh Blog</h1>
        </a>

        <section>
          <ThemeSwitcher />
        </section>
      </nav>
      <main className={tw`px-4 max-w-5xl mx-auto`}>{children}</main>
    </div>
  );
}
