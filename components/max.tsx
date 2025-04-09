import React from "react";

const Max = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full max-w-[1440px] mx-auto px-2 pt-6 md:pt-16">{children}</div>;
};

export default Max;
