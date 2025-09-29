import { createClient } from '@/lib/supabase/server'
import React from 'react'

const page =async () => {
    // const supabase = createClient()
    // const { data, error } = await supabase.from("projects").select("*")
    // if (error) {
    //     console.log(error)
    //     return <div>Error: {error.message}</div>
    // }
    // console.log("data", data)
    
    return (
        <div>page</div>
    )
}

export default page