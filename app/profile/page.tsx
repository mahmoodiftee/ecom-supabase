import { redirect } from "next/navigation";
import ProfileTabs from "./profile components/profile-tabs";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/profile";
import { FormMessage, Message } from "@/components/form-message";
import Max from "@/components/max";

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
  //orders
  const { data: orders, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", profile.id)
    .order("order_date", { ascending: false });

  if (orderError) {
    console.error("Error fetching orders:", orderError.message);
  }

  //wishlists
  const { data: bookmarks, error: bookmarkError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", profile.id);

  if (bookmarkError) {
    console.error("Error fetching bookmarks:", bookmarkError.message);
  }



  const productIds = (bookmarks || []).map((b) => b.product_id);

  let lovedItems = [];

  if (productIds.length > 0) {
    const { data: products, error: productError } = await supabase
      .from("keyboards")
      .select("*")
      .in("id", productIds);

    if (productError) {
      console.error("Error fetching loved products:", productError.message);
    } else {
      lovedItems = products;
    }
  }

  const purchaseHistory = [...(orders || [])];
  
  
  
  //payment methods

  const { data: savedPaymentMethods, error: savedPaymentMethodsError } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id);

  if (savedPaymentMethodsError) {
    console.error("Error fetching saved payment methods:", savedPaymentMethodsError.message);
  }
  const paymentMethods = [
    ...(savedPaymentMethods || []),
  ]

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
