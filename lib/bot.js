import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { prompt } from "./prompt.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// Match your prompt structure in Zod
const OutputSchema = z.object({
    title: z.string().describe("The title for the project"),
    loadAnalysis: z.object({
        daysOfAutonomy: z.string().describe("The days of autonomy for the project"),
        totalLoad: z.string().describe("The total load for the project"),
        dailyUsageDuration: z.string().describe("The daily usage duration for the project"),
        dailyEnergyConsumption: z.string().describe("The daily energy consumption for the project"),
    }).describe("The load analysis for the project"),
    batteryBankSizing: z.string().describe("The battery bank sizing for the project and show the calculations"),
    solarPVArraySizing: z.string().describe("The solar PV array sizing for the project"),

    chargeControllerSizing: z.string().describe("The charge controller sizing for the project"),
    inverterSizing: z.string().describe("The inverter sizing for the project"),
    breakerSizing: z.string().describe("The breaker sizing for the project"),
    brandSuggestions: z.string().describe("  suggestions best brand for the project"),
    summary: z.string().describe("The summary for the project"),
    suggestions: z.string().describe("The suggestions for the project"),
    notes: z.string().describe("The notes for the project"),
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.5,
    apiKey: process.env.GOOGLE_API_KEY || "",
    // maxRetries: 2,
})

const llm = new ChatOpenAI({
    model: "gpt-4.1",
    temperature: 0.5,
    apiKey: process.env.OPENAI_API_KEY,
    // maxRetries: 2,
})

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", prompt],
    [
        "human",
        `
    You are a professional in solar installations. 
    You must generate a solar installation plan for a house based on the input: {input}.
    Respond ONLY using the structured fields in the schema.`,
    ],
]);

const structuredLlm = model.withStructuredOutput(OutputSchema);
const chain = promptTemplate.pipe(structuredLlm);

// Run chain
export async function generateProject({input}) {
    console.log("input", input)
    
   try {
       const result = await chain.invoke({
           input: input
       });

       return { result: result,ok:true}
   } catch (error) {
       console.log("error", error)
       return {error:error.message,ok:false}
   }
    
}
