// This file is required by Next.js when there are unmatched routes outside [locale].
// The middleware will normally redirect to /he/not-found, but this fallback covers edge cases.
import { redirect } from "next/navigation";

export default function RootNotFound(): never {
  redirect("/he");
}
