"use client"
import { createClient } from '@/lib/supabase/client'
import { redirect, useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import UserMessage from '../../_components/UserMessage'
import AiMessage from '../../_components/AiMessage'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import Footer from '@/components/footer/Footer'
import { se } from 'date-fns/locale'
const page = () => {
  const param = useParams()
  const { projectId } = param
  const [messages, setMessages] = useState([])
  const [Loading, setLoading] = useState(false)
  const [credite, setCredite] = useState(0)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState("")

  const router = useRouter()

  const supabase = createClient()




  // get messages
  async function getMessages() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("messages").select("*").eq("project_id", projectId)
      if (error) {
        console.log(error)
        return <div>Error: {error.message}</div>
      }
      console.log("data", data)
      setMessages(data)

    } catch (error) {
      console.log("error", error)
    }
  }

  // generate project api call
  async function generateProject() {
    const supabase = createClient()
    if (credite === 0) {
      toast.error(`You don't have enough credits`)
      router.push("/payment")
      return
    }
    try {
      const Project = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: messages[0]?.prompt,
        }),
      })
      const data = await Project.json()
      console.log("data", data)
      if (Project.ok) {
        await supabase.from("projects").update({
          title: Project.title
        }).eq("id", projectId)
        const { data: message, error } = await supabase.from("messages").insert({
          title: data.title,
          loadAnalysis: data.loadAnalysis,
          batteryBankSizing: data.batteryBankSizing,
          solarPVArraySizing: data.solarPVArraySizing,
          chargeControllerSizing: data.chargeControllerSizing,
          inverterSizing: data.inverterSizing,
          summary: data.summary,
          suggestions: data.suggestions,
          notes: data.notes,
          project_id: projectId,
          role: "AI"

        }).select("*")
        if (error) {
          setIsLoading(false)
          toast.error(`Error: ${error.message}`)
        } else {
          setIsLoading(false)
          toast.success(`Success `)
          //  router.push(`/dashboard/${message[0].id}`)
        }


        await supabase.from("profile").update({
          credite: credite - 1
        })
      }
    } catch (error) {
      console.log("error", error)
      toast.error(`Error: ${error.message}`)
    }



  }

  async function getProfile() {
    const profile = await supabase.from("profile").select(
      "*",
    )
    const user = profile.data[0]
    setCredite(user.credite)
    setUser(user);

    // setUser(user);
  }

  // generate project
  useEffect(() => {
    if (messages.length === 1) {
      generateProject()
    }
  }, [messages])

  // get messages
  useEffect(() => {
    getMessages()


  }, [])

  // subscribe to messages
  useEffect(() => {
    async function getMessages() {
      try {
        setLoading(true)
        const channel = supabase.channel("messages").on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            console.log("payload", payload)
            setMessages((prev) => [...prev, payload.new])
          }
        ).subscribe()

      } catch (error) {
        setLoading(false)
        console.log(error)
        toast.error(`Error: ${error.message}`)
      }
    }
    getMessages();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase])

  // get user profile
  useEffect(() => {
    getProfile()
  }, [projectId])


  // handle submit
  async function handleSubmit(e) {
    e.preventDefault()
    if (credite === 3) {
      toast.error(`You don't have enough credits`)
      router.push("/payment")

    }
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("messages").insert({
        role: "USER",
        prompt: value,
        project_id: projectId,
      }).select().single()
      setValue("")
      if (error) {
        toast.error(`Error: ${error.message}`)
      } else {
        setIsLoading(true)

        const respond = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: value,
          }),
        })
        const data = await respond.json()
        if (respond.ok) {

          const { data: message, error } = await supabase.from("messages").insert({
            title: data.title,
            loadAnalysis: data.loadAnalysis,
            batteryBankSizing: data.batteryBankSizing,
            solarPVArraySizing: data.solarPVArraySizing,
            chargeControllerSizing: data.chargeControllerSizing,
            inverterSizing: data.inverterSizing,
            summary: data.summary,
            suggestions: data.suggestions,
            notes: data.notes,
            project_id: projectId,
            role: "AI"
          }).select().single()
          if (error) {
            setIsLoading(false)
            toast.error(`Error: ${error.message}`)
          } else {
            setIsLoading(false)

            //  router.push(`/dashboard/${message[0].id}`)
          }

          await supabase.from("profile").update({
            credite: credite - 1
          }).select().eq("id", user.id)
        }

      }


    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.error(`Error: ${error.message}`)
    }
  }

  return (
    <>

      <div className='w-full min-h-screen  flex flex-col items-start justify-center overflow-auto scrollbar-hide relative '>



        <div className='w-full  overflow-auto scrollbar-hide mt-44 mb-24 pb-20 '>
          {
            messages.map((item, index) => {
              return (
                <div key={index} className={cn(
                  ' w-full  flex flex-col  ',
                )}>

                  <div className={cn(
                    'w-full  flex flex-col justify-center gap-2 p-4',

                  )}>
                    {
                      item.role === "USER" ? <UserMessage message={item} /> : <AiMessage message={item} />
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className=' w-full flex justify-end px-20'>
          {
            isLoading && <span className="animate-pulse " >thinking...</span>
          }

        </div>
        <div className='w-full flex flex-col justify-center items-center gap-2   '>
          {/* <div
            className={cn('flex flex-col items-center justify-center max-w-4xl mx-auto w-full h-10 bg-transparent  opacity-2 rounded-lg p-4 shadow-md gap-4',)}
          /> */}

          <div className="mt-4 bg-gray-200  max-w-3xl flex w-full items-end mb-2 max-auto border-2 border-gray-300 rounded-lg p-4 text-md ">
            <textarea
              value={value}
              className={"resize-none w-[95%] h-20  focus:outline-0 "}
              onChange={(e) => setValue(e.target.value)}
            />
            <Send size={25}
              onClick={handleSubmit}
              className="cursor-pointer"
            />

          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>

  )
}

export default page