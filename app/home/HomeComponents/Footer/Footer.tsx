import Max from "@/components/max";

export default function Footer() {
  return (
    <Max>
      <div
        className="relative h-[150px]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="fixed -bottom-32 w-full flex justify-start pl-10 items-center">
          <h1 className="text-[14rem] font-extrabold">KEEBHOUS</h1>
        </div>
      </div>
    </Max>
  );
}
