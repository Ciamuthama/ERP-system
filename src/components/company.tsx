import Image from "next/image";
import React, { useEffect, useState } from "react";
interface Company {
  id: string;
  logo: string;
  companyName: string;
  email: string;
  telephone: string;
}
export default function Company() {
  const [compData, setCompData] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/saccosettings");
      const data = await response.json();
      setCompData(data);
    };
    fetchData();
  }, []);

  return (
    <>
    <Image
    src={compData.logo}
    alt="Logo"
    width={300}
    height={300}
    />
    <h4 className="font-semibold">Company Name: {compData.companyName}</h4>
    <p className="font-semibold">Email: {compData.email}</p>
    <p className="font-semibold">Phone Number: {compData.telephone}</p>
    <p className="font-semibold">Address: {compData.address}</p>
    </>
  );
}
