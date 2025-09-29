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
import { id } from 'date-fns/locale'

const SignUpSchema = z.object({
    name: z.string().min(3, { message: "Name should be at least 3 characters" }),
    email: z.string().email().min(5, { message: "Invalid email" }),
    password: z.string().min(8, { message: "Password should be at least 8 characters" }),
    phone: z.string().min(8, { message: "Invalid phone number" }).max(15),

})

const SignUp = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
    })
    const router = useRouter()

    const onSubmit = async (data) => {
        console.log(data)

        const supabase = createClient()
        try {
            setIsLoading(true)
            const { data: userData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                phone: data.phone,
                options: {
                    // emailRedirectTo: `${window.location.origin}/auth/verify-email`,
                    data: {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        avatar_url: data.avatar_url,
                        credits: 4,
                    },
                },


            })
            if (error) {
                setIsLoading(false)
                toast.error(`Sign Up Failed: ${error.message}`)
                setError(error.message)
            } else {
                setIsLoading(false)
                const { error } = await supabase.from('user').insert({
                    id: userData.user.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                })
                if (error) {
                    setIsLoading(false)
                    toast.error(`Sign Up Failed: ${error.message}`)
                    setError(error.message)
                } else {
                    setIsLoading(false)
                    toast.success(`Sign Up Successful`)
                    localStorage.setItem("email", userData.user.email)

                    router.push("/auth/verify-email")
                }

            }
        }
        catch (error) {
            setIsLoading(false)
            console.log(error)
            toast.error(`Sign Up Failed: ${error.message}`)
            setError(error.message)
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
                        name="name"
                        label="Name"
                        control={form.control}
                        placeholder="Enter your name"
                        render={({ field }) => (

                            <FormItem
                                className={"w-full"}
                            >
                                <FormLabel > Name </FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" placeholder="Enter your name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
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
                    <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (

                            <FormItem
                                className={"w-full"}
                            >
                                <FormLabel > Phone </FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" placeholder="+91 99999999999" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        name="password"

                        control={form.control}
                        render={({ field }) => (

                            <FormItem
                                className={"w-full"}
                            >
                                <FormLabel > Password </FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder="**********" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <Button variant={"outline"} type="submit" className="w-full mt-4 text-gray-700 cursor-pointer font-semibold" disabled={isLoading}>
                        Sign Up
                        {isLoading && <span className="ml-2 animate-bounce text-gray-500 ">...</span>}
                    </Button>

                    <div>
                        <p className="text-center text-sm text-gray-50">
                            Already have an account? <Link href="/auth/sign-in">Sign In</Link>
                        </p>
                        <p className="text-center text-sm text-gray-50">
                            By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
                        </p>
                    </div>


                </form>
            </Form>

        </div>
    )
}

export default SignUp