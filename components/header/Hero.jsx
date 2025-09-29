"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";


const Samples = [
  "I need a solar system, I'm using total load of 2000watt and need a 24volt battery system. the light is to be used for 5hours",
  "I need a solar system, I'm using total load of 5000watt and need a 24volt battery system. the light is to be used for 15hours",
  "I need a solar system, I'm using total load of 10000watt and need a 24volt battery system. the light is to be used for 24hours",

]

const Hero = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState("")
  const router = useRouter()
 
  // const splitValue= value.split(" ")
  // const title = splitValue.join 
  // console.log("splitValue", splitValue)
  // console.log("title", title)
  
  


  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setIsLoading(true)
      // const res = await getTitle(value)
      // console.log("title", res)
      const supabase = createClient()
      const { data: project, error } = await supabase.from("projects").insert({
        title: "solar energy"
      }).select("*")
      if (error) {
        setIsLoading(false)
        toast.error(`Error: ${error.message}`)
      } else {
        const { data: message, error } = await supabase.from("messages").insert({
          prompt: value,
          project_id: project[0].id,
          role: "USER"
        }).select("*")
        if (error) {
          setIsLoading(false)
          toast.error(`Error: ${error.message}`)
        } else {
          setIsLoading(false)

          toast.success(`Success: ${project[0].id}`)
          router.push(`/dashboard/${project[0].id}`)
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.error(`Error: ${error.message}`)
    }

  }

  // bg - [#245A95]
  //   <div className="w-full h-[100vh] bg-gradient-to-r from-blue-500 to-purple-400 via-purple-600 flex flex-col text-white">
  return (
    <div className="w-full h-[100vh] bg-gray-200 flex flex-col ">
      <div className="max-w-6xlw-full flex flex-col items-center h-full mt-20 gap-4 ">

        <span className="max-w-2xl mx-auto font-bold lg:text-4xl md:text-2xl text-xl mb-2 ">
          making your solar calculations and estimate easy and fast
        </span>
        <p className="max-w-2xl font-semibold text-center  ">
          A powerful AI that can help you generate the size of solar panels,
          chargers controller, batteries quantity and estimated of the power
          to be generated.
        </p>

        <div className="max-w-2xl w-full px-4 border-2 border-gray-300 rounded-lg min-h-44 ">
          <div className="flex w-full items-end ">
            <textarea
              value={value}
              className={"resize-none w-[95%] h-40 border-2 focus:outline-0 "}
              onChange={(e) => setValue(e.target.value)}
            />
            {
              isLoading ? <Loader2 className="animate-spin" /> : <Send size={25}
                onClick={handleSubmit}
                className="cursor-pointer"
              />
            }
          </div>
        </div>

        <div className="max-w-3xl w-full flex  flex-wrap  items-center gap-2 ">
          {
            Samples.map((item, index) => {
              return (
                <div key={index}
                  onClick={() => setValue(item)}
                  className="max-w-60 px-2   cursor-pointer text-xs rounded-lg   py-2 border-2  border-gray-300 line-clamp-4 ">
                  {item}
                </div>


              )
            })
          }
        </div>

        {/* <div
          className="w-mx px-2 bg-gradient-to-r from-blue-500 to-purple-400 via-purple-600 text-xl font-bold cursor-pointer rounded-lg py-2 border-2"
        >
          <Button className="bg-gradient-to-r from-blue-500 to-purple-400 via-purple-600 text-xl font-bold cursor-pointer  ">
            <Link href="/dashboard">GetStart</Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
