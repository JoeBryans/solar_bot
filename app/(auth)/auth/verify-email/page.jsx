"use client"
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const page = () => {
    const [value, setValue] = React.useState('')
    const [error, setError] = React.useState(null)
    const [email, setEmail] = React.useState(null)
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const handleSubmit = async () => {
        const supabase = createClient()
        try {
            setIsLoading(true)
            const { data, error } = await supabase.auth.verifyOtp({
                type: "email",
                email: email,
                token: value,
            })

            if (error) {
                setIsLoading(false)
                toast.error(`verify Email Failed: ${error.message}`)
                setError(error.message)
            }
            else {
                setIsLoading(false)
                toast.success(`Verify Email Successful`)
                localStorage.removeItem("email")
                router.push("/dashboard")
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)
            toast.error(`Sign Up Failed: ${error.message}`)
            setError(error.message)
        }

    }

    useEffect(() => {
        // console.log("value.length", value.length)
        //  async function getEmail() {
        //      const supabase = createClient()
        //      const session = await supabase.auth.getSession()
        //      console.log("session", session)
        //  }
        //     getEmail()
        if (window !== undefined) {
            const email = localStorage.getItem("email")
            setEmail(email)

        }
        if (email !== null && value.length === 6) {
            console.log("value.length", value.length)

            handleSubmit()
        }

    }, [value])



    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <div
                className={cn('flex flex-col items-center justify-center max-w-md mx-auto w-full bg-gray-900 rounded-lg p-4 shadow-md gap-4',
                    isLoading && 'animate-pulse bg-gray-600'

                )}
            >
                <h1 className="text-center text-2xl font-bold text-white">Verify Email</h1>
                {
                    error && <p className="text-center text-sm text-red-500 w-full bg-red-200 rounded-lg p-1.5">{error}</p>
                }
                <InputOTP
                    maxLength={6}
                    value={value}

                    onChange={(value) => setValue(value)}
                >
                    <InputOTPGroup >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>



            </div>
        </div>
    )
}

export default page