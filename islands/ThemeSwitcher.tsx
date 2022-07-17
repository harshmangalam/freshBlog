/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export default function ThemeSwitcher() {
  return (
    <button
      className={tw`rounded-full border border-gray-600 hover:bg-gray-100  focus:outline-none h-10 w-10 grid place-items-center`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={tw`h-6 w-6`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
