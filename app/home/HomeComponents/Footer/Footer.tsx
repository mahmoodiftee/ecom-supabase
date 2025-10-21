import Max from "@/components/max";

export default function Footer() {
  return (
    <Max>
      <div className="w-full max-w-[1340px] mx-auto px-2 pt-6 md:pt-10 -mt-12">
        <div
          className="relative h-[150px] hidden lg:block"
          style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
          <div className="fixed -bottom-32 w-full flex justify-start pl-10 items-center">
            <h1 className="text-[14rem] font-extrabold">KEEBHOUS</h1>
          </div>
        </div>
        <div className="h-[200px] block lg:hidden py-8 text-center">
          <h1 className="text-3xl font-bold">KEEBHOUS</h1>
        </div>
      </div>
    </Max>
  );
}