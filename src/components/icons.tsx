import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.23 14.73 22 13V6l-5 3-5-3-5 3-5-3v7l5.12 3.07" />
      <path d="M22 6 12 11 2 6" />
      <path d="M12 22V11" />
      <path d="m7 19.5 5-3 5 3" />
    </svg>
  );
}
