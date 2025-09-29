"use client"
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { it } from 'zod/v4/locales'

const SideBar = () => {
    const [projectTitles, setProjectTitles] = React.useState([])
    console.log("projectTitles", projectTitles)
    useEffect(() => {
        const supabase = createClient()
        async function getProjects() {
            try {
                const { data, error } = await supabase.from("projects").select("*")
                if (error) {
                    console.log(error)
                    return <div>Error: {error.message}</div>
                }
                setProjectTitles(data)
            } catch (error) {
                console.log("error", error)
            }
        }
        getProjects()
    }, [])
    return (
        <div className='fixed  w-56  h-screen bg-gray-50 flex flex-col overflow-auto scrollbar-hide'>
            <div className='flex flex-col gap-4 '>
                {/* <div className='text-xl font-bold text-center'>Projects</div> */}
                {
                    projectTitles.map((item, index) => {
                        return (
                            <div key={index} className='flex gap-2 items-center cursor-pointer px-5'>
                                {/* <div className='w-4 h-4 bg-gray-500 rounded-full'></div> */}
                                <Link href={`/dashboard/${item?.id}`}
                                    className='line-clamp-1 text-md'
                                >{item?.title}</Link>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default SideBar