// app/api/complete-order/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    // console.log("API route hit");
    const { items, email, user_id, totalPrice, user } = await request.json();
    if (!items || !email || !user_id || totalPrice === 0) {
        console.error("Missing required fields");
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try {
        for (const item of items) {
            const { data: keyboard, error: fetchErr } = await supabase
                .from("keyboards")
                .select("quantity")
                .eq("id", item.id)
                .single();

            if (fetchErr || !keyboard) {
                console.error(`Failed to fetch keyboard ${item.id}`, fetchErr);
                continue;
            }

            const newQty = Math.max(0, (keyboard.quantity as number) - item.quantity);

            const { error: updateErr } = await supabase
                .from("keyboards")
                .update({ quantity: newQty })
                .eq("id", item.id);

            if (updateErr) {
                console.error(`Failed to update stock for ${item.id}`, updateErr);
                continue;
            }
        }

        const { error: insertErr } = await supabase.from("orders").insert({
            user_id,
            email,
            items,
            total_amount: totalPrice,
            order_user: user
        });

        if (insertErr) throw insertErr;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Order error:", err);
        return NextResponse.json(
            { error: "Failed to complete order" },
            { status: 500 }
        );
    }
}