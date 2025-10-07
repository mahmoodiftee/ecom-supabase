import Max from "@/components/max";

export default function Footer() {
  return (
    <div className="w-full max-w-[1340px] mx-auto px-2 pt-6 md:pt-10 -mt-12">
      <div
        className="relative h-[150px]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* Use absolute instead of fixed, and center text */}
        <div className="absolute inset-0 flex justify-center items-center">
          <h1
            className="
              font-extrabold 
              text-center 
              leading-loose
              text-[4rem] 
              sm:text-[6rem] 
              md:text-[8rem] 
              lg:text-[12rem] 
              xl:text-[14rem]
            "
          >
            KEEBHOUSE
          </h1>
        </div>
      </div>
    </div>
  );
}
