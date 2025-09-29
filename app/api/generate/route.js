import { generateProject } from "@/lib/bot"
import { NextResponse } from "next/server"

export async function POST(request) {
    const { input } = await request.json()
    console.log("input", input)
    try {
        const response = await generateProject({ input })
        if (response.ok) {
            return NextResponse.json(response.result)
        } else {
            return new Response(JSON.stringify({ error: res.error }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }


    } catch (error) {
        console.log("error", error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}