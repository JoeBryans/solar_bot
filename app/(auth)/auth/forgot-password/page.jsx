"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ro } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const [value, setValue] = React.useState('')
    const [error, setError] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const router = useRouter()

    const supabase = createClient()

    async function handelRestPassword(e) {
        e.preventDefault()

        try {
            // setIsLoading(true)
            const { data, error } = await supabase.auth.resetPasswordForEmail(value, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
            })
            if (error) {
                setIsLoading(false)
                console.log(error)
                toast.error(`reset Password Failed: ${error.message}`)
                setError(error.message)
            }
            router.push("/auth/reset-password")

        } catch (error) {
            setIsLoading(false)
            console.log(error)
            toast.error(`reset Password Failed: ${error.message}`)
            setError(error.message)
        }
    }


    return (
        <div className='w-full h-screen flex flex-col items-center justify-center px-5'>
            <div
                className={'flex flex-col items-center justify-center max-w-md mx-auto w-full bg-gray-200 rounded-lg p-4 shadow-md gap-4 text-gray-700'}
            >
                <h1 className="text-center text-2xl font-bold "> Forgot Password</h1>
                {
                    error && <p className="text-center text-sm text-red-500 w-full bg-red-200 rounded-lg p-1.5">{error}</p>
                }
                <form className='w-full flex flex-col gap-4'>
                    <Label htmlFor="email">Enter your email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jhon@gmail.com"
                        required
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className={"border-2 border-gray-500 text-lg"}
                    />

                  
                    <Button variant={"default"} type="submit" className="w-full mt-4  cursor-pointer font-semibold text-gray-50" disabled={value.length === 0}
                        onClick={handelRestPassword}

                    >
                        Rest Password
                        {isLoading && <span className="ml-2 text-gray-500 animate-bounce text-xl">...</span>}

                    </Button>
                </form>


            </div>
        </div>
    )
}

export default page