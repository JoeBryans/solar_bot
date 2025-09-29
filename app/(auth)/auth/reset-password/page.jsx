"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import React from 'react'
import { toast } from 'sonner'
import { set } from 'zod'

const page = () => {
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [error, setError] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const supabase = createClient()

    async function handelRestPassword(e) {

        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error(`Passwords do not match`)
            setError(`Passwords do not match`)
            
            return null
        } else {
            if (password.length < 10) {
                setError(`Password must be at least 10 characters`)
                return null
            }
            setIsLoading(true)
            try {
                const { data, error } = await supabase.auth.updateUser({ password: password })
                if (error) {
                    console.log(error)
                    toast.error(`reset Password Failed: ${error.message}`)
                    setError(error.message)
                }
                else {
                    setIsLoading(false)
                    toast.success(`Password Reset Successful`)
                    router.push("/dashboard")
                }
            } catch (error) {
                setIsLoading(false)
                toast.error(`Sign Up Failed: ${error.message}`)
                setError(error.message)
            }
        }
    }


    return (
        <div className='w-full h-screen flex flex-col items-center justify-center px-5'>
            <div
                className={'flex flex-col items-center justify-center max-w-md mx-auto w-full bg-gray-200 rounded-lg p-4 shadow-md gap-4 text-gray-700'}
            >
                <h1 className="text-center text-2xl font-bold "> Reset Your Password</h1>
                {
                    error && <p className="text-center text-sm text-red-500 w-full bg-red-200 rounded-lg p-1.5">{error}</p>
                }
                <div className='w-full flex flex-col gap-4'>
                    <div className='w-full flex flex-col gap-4'>
                        <Label htmlFor="password">Enter your new password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={"border-2 border-gray-500 text-lg"}
                        />
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <Label htmlFor="confirmEmail">Confirm your email</Label>
                        <Input
                            type="password"
                            id="confirmEmail"
                            name="confirmPassword"
                            placeholder="********"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={"border-2 border-gray-500 text-lg"}
                        />
                    </div>

                    
                    <Button variant={"default"}  className="w-full mt-4  cursor-pointer font-semibold text-gray-50" disabled={password.length === 0 || confirmPassword.length === 0}
                        onClick={handelRestPassword}

                    >
                        Save
                        {isLoading && <span className="ml-2 text-gray-500 animate-bounce text-xl">...</span>}

                    </Button>
                </div>


            </div>
        </div>
    )
}

export default page