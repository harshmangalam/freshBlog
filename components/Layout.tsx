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
    <div class={tw`min-h-screen bg-white`}>
      <Head>
        <title>{title}</title>
      </Head>
      {/* navbar  */}
      <nav
        className={tw`flex justify-between items-center max-w-5xl py-8 mx-auto px-4`}
      >
        <h1
          className={tw`text-3xl font-medium`}
        >
          Fresh Blog
        </h1>

        <section>
          <ThemeSwitcher />
        </section>
      </nav>
      <main className={tw`px-4 max-w-5xl mx-auto`}>{children}</main>
    </div>
  );
}
