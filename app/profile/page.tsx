import { redirect } from "next/navigation";
import ProfileTabs from "./profile components/profile-tabs";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/profile";
import { FormMessage, Message } from "@/components/form-message";
import ProfileHeader from "./profile components/profile-header";
import Max from "@/components/max";
import { useUser } from "@/context/ProfileContext";

export default async function Profile(props: {
  searchParams: Promise<Message>;
}) {

  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  if (!user || !user?.id) {
    return redirect("/sign-in");
  }

  const profile = await getUserProfile(user?.id);
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", profile.id)
    .order("order_date", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
  }
  // Mock data for demonstration
  const lovedItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 249.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Laptop Sleeve",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  const purchaseHistory = [...(orders || [])];

  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      expiry: "05/25",
      default: true,
    },
    { id: 2, type: "PayPal", email: "user@example.com", default: false },
  ];

  return (
    <Max>
      <div className="w-full min-h-screen">
        <ProfileTabs
          profile={profile}
          user={user}
          lovedItems={lovedItems}
          purchaseHistory={purchaseHistory}
          paymentMethods={paymentMethods}
        />
      </div>
    </Max>
  );
}

// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getUserProfile } from "@/utils/profile";
// import { updateProfileAction } from "@/app/actions";
// import { FormMessage, Message } from "@/components/form-message";
// import { SignOut } from "@/components/singOut";

// export default async function Profile(props: {
//   searchParams: Promise<Message>;
// }) {
//   const searchParams = await props.searchParams;

//   if ("message" in searchParams) {
//     return (
//       <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
//         <FormMessage message={searchParams} />
//       </div>
//     );
//   }

//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user || !user?.id) {
//     return redirect("/sign-in");
//   }

//   const profile = await getUserProfile(user?.id);

//   return (
//     <div className="w-full p-4">
//       <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>

//       <form className="space-y-4 max-w-md mx-auto">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative group">
//             {profile?.avatar_url ? (
//               <img
//                 src={profile.avatar_url}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
//               />
//             ) : (
//               <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
//                 {profile?.full_name?.charAt(0).toUpperCase() || "U"}
//               </div>
//             )}
//             <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//               <Label
//                 htmlFor="avatar"
//                 className="text-white text-sm cursor-pointer p-2 bg-black bg-opacity-50 rounded"
//               >
//                 Change Photo
//               </Label>
//             </div>
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             name="email"
//             defaultValue={user.email || ""}
//             disabled
//           />
//         </div>

//         <div>
//           <Label htmlFor="full_name">Full Name</Label>
//           <Input
//             id="full_name"
//             name="full_name"
//             defaultValue={profile?.full_name || ""}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="phone">Phone Number</Label>
//           <Input
//             id="phone"
//             name="phone"
//             defaultValue={profile?.phone || ""}
//             required
//           />
//         </div>

//         <div className="hidden">
//           <Label htmlFor="avatar">Profile Image</Label>
//           <Input
//             type="file"
//             id="avatar"
//             name="avatar"
//             accept="image/*"
//             className="hidden"
//           />
//         </div>

//         <SubmitButton
//           formAction={updateProfileAction}
//           pendingText="Updating..."
//           className="w-full"
//         >
//           Update Profile
//         </SubmitButton>
//         <SignOut />
//         <FormMessage message={searchParams} />
//       </form>
//     </div>
//   );
// }
