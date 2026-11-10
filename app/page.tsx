import { redirect } from "next/navigation"

// The pitch deck is a self-contained static site in public/pitch/.
export default function Page() {
  redirect("/pitch/index.html")
}
