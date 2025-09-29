import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai";
import { prompt } from "./prompt.js";
import { z } from "zod";
const OutputSchema = z.object({
    title: z.string().describe("The title for the project"),
    // loadAnalysis: yup.object({
    //     totalLoad: yup.number().describe("The total load for the project"),
    //     dailyUsageDuration: yup.number().describe("The daily usage duration for the project"),
    //     dailyEnergyConsumption: yup.number().describe("The daily energy consumption for the project"),
    // }),
    batteryBankSizing: z.string().describe("The battery bank sizing for the project"),
    // solarPVArraySizing: yup.string().describe("The solar pv array sizing for the project"),
    // chargeControllerSizing: yup.string().describe("The charge controller sizing for the project"),
    // inverterSizing: yup.string().describe("The inverter sizing for the project"),
    summary: z.string().describe("The summary for the project"),
    suggestions: z.string().describe("The suggestions for the project"),
    notes: z.string().describe("The notes for the project"),
    // balanceOfSystem: yup.string().describe("The balance of system for the project"),

})


// const llm = new ChatGoogleGenerativeAI({
//     model: "gemini-2.5-flash",
//     temperature: 0.5,
//     apiKey: "AIzaSyCr8mlM-AZaxMgy6WkjHp1P6L5NtaS0T84",
//     // maxRetries: 2,
// })



const llm = new ChatOpenAI({
    model: "gpt-4.1",
    temperature: 0.5,
    apiKey: process.env.OPENAI_API_KEY,
    // maxRetries: 2,
})


const promptTemlate = ChatPromptTemplate.fromMessages(
    [
        ["system", prompt],
        ["human",

            `
        you are a professional in solar installations. you have to generate a solar installation plan for a house based on the input:{input}

        title: The title for the project
     loadAnalysis: The load analysis for the project
     batteryBankSizing: The battery bank 
     sizing for the project
     solarPVArraySizing: The solar pv array sizing for the project
     chargeControllerSizing: The charge controller sizing for the project
     inverterSizing: The inverter sizing for the project
        summary: The summary for the project
     suggestions: The suggestions for the project
     notes: The notes for the project
 

            
        `]
    ]
)
const structureLlm = llm.withStructuredOutput(OutputSchema)
console.log("structureLlm :", structureLlm)
const chain = promptTemlate.pipe(structureLlm)

// console.log("chain :", chain)
// console.log("prompt :",prompt)

const res = await chain.invoke({
    input: "I need a solar system, I'm using total load of 2000watt and need a 24volt battery system. the light is to be used for 5hours"
})
console.log("respond :", res)


// console.log("respond :",res)
// const output=JSON.parse(res.content)
// console.log("output :", output)
// export async function getProject(input) {

//     const res = await chain.invoke({
//         input: input
//     })
//     console.log("respond :", res.content)
//     const content = res.content
//     return content
// }