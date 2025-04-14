"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function HeaderAuth() {
  // For demo purposes, we'll just show a sign in button
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="#" className="flex items-center gap-1">
          <User className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  );
}

// import { signOutAction } from "@/app/actions";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
// import Link from "next/link";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { createClient } from "@/utils/supabase/server";

// export default async function AuthButton() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!hasEnvVars) {
//     return (
//       <>
//         <div className="flex gap-4 items-center">
//           <div>
//             <Badge
//               variant={"default"}
//               className="font-normal pointer-events-none"
//             >
//               Please update .env.local file with anon key and url
//             </Badge>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               asChild
//               size="sm"
//               variant={"outline"}
//               disabled
//               className="opacity-75 cursor-none pointer-events-none"
//             >
//               <Link href="/sign-in">Sign in</Link>
//             </Button>
//             <Button
//               asChild
//               size="sm"
//               variant={"default"}
//               disabled
//               className="opacity-75 cursor-none pointer-events-none"
//             >
//               <Link href="/sign-up">Sign up</Link>
//             </Button>
//           </div>
//         </div>
//       </>
//     );
//   }
//   return user ? (
//     <div className="flex items-center gap-4">
//       Hey, {user.email}!
//       <form action={signOutAction}>
//         <Button type="submit" variant={"outline"}>
//           Sign out
//         </Button>
//       </form>
//     </div>
//   ) : (
//     <div className="flex gap-2">
//       <Button asChild size="sm" variant={"outline"}>
//         <Link href="/sign-in">Sign in</Link>
//       </Button>
//       <Button asChild size="sm" variant={"default"}>
//         <Link href="/sign-up">Sign up</Link>
//       </Button>
//     </div>
//   );
// }
