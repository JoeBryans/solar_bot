"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter()
  const isDashboard = pathname.includes("dashboard");
  const supabase = createClient();

  // console.log("user", user)

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return null;
    }
    const user = data.user
    setLoggedUser(user);


  }

  useEffect(() => {
    getUser();
    if (loggedUser !== null) {
      async function getProfile() {
        const profile = await supabase.from("profile").select(
          "*",
        ).eq("id", loggedUser.id)
        const user = profile.data[0]
        setUser(user);
        //  setProfile(profile.data[0])
      }
      getProfile()
    }

  }, [loggedUser]);
  // const user = false;
  return (
    <div className="w-full bg-gray-900 shadow-md border-b-2  text-gray-100 py-2 px-4">

      <div className="max-w-[65rem]  w-[90%] flex flex-col mx-auto">
        <div className=" bg-gray-900 flex justify-between items-center ">
          <Logo />
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li className="text-lg font-demi-bold">
                {user !== null ? (
                  <div className="flex items-center gap-4 ">
                    <div className="">
                      <span className="flex gap-2">Hello, {user?.name}</span>

                      {/* <Image
                       src={user.user_metadata.avatar_url}
                       alt="Avatar"
                       width={40}
                       height={40}
                       className="rounded-full"
                      /> */}
                    </div>

                    {
                      isDashboard ? <div className="flex gap-4 items-center">
                        <div className="bg-gray-100 h-8 w-8  p-1  rounded-full text-gray-800 text-center ">
                          {user?.credite || 0}
                        </div>
                        <Button
                          variant={"outline"}
                          className="cursor-pointer text-gray-800"
                          onClick={async () => {
                            const supabase = createClient()
                            await supabase.auth.signOut()
                            // setUser(null)
                            router.push("/")
                          }}
                        >
                          sign out
                        </Button>
                      </div> : <Link
                        className="bg-gray-300 text-gray-700 py-1.5 px-2 rounded-md "
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    }

                  </div>


                ) : (
                  <Link href="/auth/sign-in"

                  >
                    <Button variant={"secondary"}
                      className="cursor-pointer"
                    >Sign In</Button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
