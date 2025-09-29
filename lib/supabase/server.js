import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import dotenv from 'dotenv'
dotenv.config()
export async function createClient() {
    const cookieStore = await cookies()
 
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    // console.log("getCookieStore", cookieStore.getAll())
                    
                    return cookieStore.getAll()
                },
             
            },
        }
    )
}