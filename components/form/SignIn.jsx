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
                    emailRedirectTo: `${window.location.origin}/auth/verify-email`
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
                    className='flex flex-col items-center justify-center max-w-md mx-auto w-full bg-gray-900 rounded-lg p-4 shadow-md gap-4'
                >
                    <h1 className="text-center text-2xl font-bold text-white">Sign Up</h1>
                    {
                        error && <p className="text-center text-sm text-red-500 w-full bg-red-200 rounded-lg p-1.5">{error}</p>
                    }
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (

                            <FormItem
                                className={"w-full"}
                            >
                                <FormLabel > Email </FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="jhon@gmail.com" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />


                    <Button variant={"outline"} type="submit" className="w-full mt-4 text-gray-700 cursor-pointer font-semibold" disabled={isLoading}>
                        Sign Up
                        {isLoading && <span className="ml-2 text-gray-500 animate-bounce">...</span>}
                    </Button>

                    <div>
                        <p className="text-center text-sm text-gray-50">
                            Don't have an account?
                            <Link href="/auth/sign-up"> Sign Up</Link>
                        </p>

                        <p className="text-center text-sm text-gray-50 mt-4">
                            forgot password?
                            <Link href="/auth/forgot-password"> Forgot Password</Link>
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