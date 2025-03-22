import React from "react";

const Max = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full max-w-screen-2xl mx-auto">{children}</div>;
};

export default Max;
