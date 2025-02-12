"use client";

import { Loader } from "@/src/components/lib/loader";
import { UserNotLogin } from "@/src/components/lib/user";
import Recruiter from "@/videoComponents/Recruiter";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyPage() {
  const { data, status } = useSession();
  const params = useParams();
  const { id } = params;
  const userData = data?.user;
  interface UserRole {
    isCandidate?: boolean;
    isAdmin?: boolean;
    isEmployer?: boolean;
  }

  interface SessionUser {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  }

  const [comapanyData, setCompanyData] = useState<any[]>([]);
  const [usersData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const response = await fetch(`/api/v1/events/${id}/companies`, {
        // Change it please Arnav
        method: "POST",
      });
      console.log("response", response);
      const data = await response.json();
      console.log("Data", data);

      var companyDataList: any[] = [];

      const companydata = [...data.companiesRegistered].map((company: any) => {
        const detailList = company.jobsDetails.map((job: any) => {
          companyDataList.push({
            job: job,
            company: company,
          });
          return {
            job: job,
            company: company,
          };
        });
        // companyDataList.push(detailList);
      });
      console.log("companyDataList", companyDataList);
      setCompanyData(companyDataList);
    };
    const fetchUserData = async () => {
      console.log("ID", id);
      const response = await fetch(`/api/v1/events/${id}/users`, {
        // Change it please Arnav
        method: "POST",
      });
      const data = await response.json();
      console.log("Data User", data.usersRegistered);
      setUserData([...data.usersRegistered]); //change to data.usersRegistered
    };
    fetchUserData();
    fetchCompanyData();
  }, []);

  let isEmployer = (userData as SessionUser)?.role?.isEmployer;

  useEffect(() => {
    isEmployer = (data as SessionUser)?.role?.isEmployer;
  }, [userData]);

  return (
    <>
      {status === "unauthenticated" && <UserNotLogin />}
      {userData &&
        comapanyData &&
        usersData &&
        status === "authenticated" &&
        isEmployer &&
        (id ? (
          <Recruiter
            className=" w-full h-full "
            roomidProp={id as string}
            comapanyData={comapanyData}
            usersData={usersData}
            userData={userData}
          />
        ) : (
          <div></div>
        ))}
      {status === "loading" && <Loader />}
      {/* {id ? (
        <Recruiter className=" w-full h-full " roomidProp={id as string} />
      ) : (
        <div></div>
      )} */}
    </>
  );
}
