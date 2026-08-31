import Image from "next/image";

/** Icon mark (public/logo.svg) — pair with the styled-text wordmark, there is no separate wordmark SVG. */
export function LogoMark({ size = "sm" }: { size?: "sm" | "md" }) {
  const px = size === "md" ? 34 : 28;
  return <Image src="/logo.svg" alt="" width={px} height={px} priority unoptimized aria-hidden="true" />;
}
