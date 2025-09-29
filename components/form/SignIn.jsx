"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const SignInSchema = z.object({

    email: z.string().email().min(5, { message: "Invalid email" }),


})

const SignIn = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",

        },
    })
    const router = useRouter()

    const onSubmit = async (data) => {
        const supabase = createClient()
        try {
            const { data: user, error } = await supabase.auth.signInWithOtp({
                email: data.email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`
                }
            })
            if (error) {
                toast.error(`Sign In Failed: ${error.message}`)
                setError(error.message)
            } else {
                localStorage.setItem("email", data.email)
                toast.success(`Sign In Successful`)
                router.push("/auth/verify-email")
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex flex-col items-center justify-center max-w-3xl mx-auto w-full text-gray-50 '>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col items-center justify-center max-w-md mx-auto w-full bg-gray-200 rounded-lg p-4 shadow-md gap-4 text-gray-700'
                >
                    <h1 className="text-center text-2xl font-bold ">Sign In</h1>
                    {
                        error && <p className="text-center text-sm text-red-500 w-full bg-red-200 rounded-lg p-1.5">{error}</p>
                    }
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (

                            <FormItem
                                className={"w-full "}
                            >
                                <FormLabel className={"text-lg "}> Email </FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="jhon@gmail.com"
                                        className="w-full border-2 border-gray-500 mt-2 text-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />


                    <Button variant={"default"} type="submit" className="w-full mt-4  cursor-pointer font-semibold" disabled={isLoading}>
                        Sign In
                        {isLoading && <span className="ml-2 text-gray-500 animate-bounce">...</span>}
                    </Button>

                    <div>
                        <p className="text-center  ">
                            Don't have an account?
                            <Link href="/auth/sign-up" className='hover:decoration-2 hover:underline'> Sign Up</Link>
                        </p>

                        <p className="text-center   mt-4">
                            forgot password?
                            <Link href="/auth/forgot-password" className='hover:decoration-2 hover:underline'> Forgot Password</Link>
                        </p>

                        {/* <p className="text-center text-sm text-gray-50">
                            By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
                        </p> */}
                    </div>


                </form>
            </Form>

        </div>
    )
}

export default SignIn