"use client";

import MemberForm from "@/components/MemberForm";
import { getSaccoSettings } from "@/lib/actions";
import React from "react";

export default function Home() {
  const [data, setData] = React.useState<>([]);
  React.useEffect(() => {
    getSaccoSettings().then((data) => setData(data));
  }, []);
  console.log(data.map((item) => console.log(item.companyName)));

  return (
    <div className="w-full mx-5">
      {data.map((item, index) => (
        <div>
          <p key={index}>{item.companyName}</p>
          <img src={`${item.logo}`} />
        </div>
      ))}
      <MemberForm />
    </div>
  );
}
