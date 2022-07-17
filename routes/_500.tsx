/** @jsx h */
import { h } from "preact";
import { ErrorPageProps } from "$fresh/server.ts";
import Layout from "components/Layout.tsx";

export default function Error500Page({ error }: ErrorPageProps) {
  return (
    <Layout title="500">
      <p>500 internal error: {(error as Error).message}</p>;
    </Layout>
  );
}
