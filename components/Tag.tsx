/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function Tag({title}:{title:string}) {
  return (
    <p
      className={tw`text-xs rounded-full px-3 py-1 border text-gray-600 uppercase`}
    >
      {title}
    </p>
  );
}
