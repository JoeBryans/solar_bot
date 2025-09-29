import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { prompt } from "./prompt.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Match your prompt structure in Zod
const OutputSchema = z.object({
    title: z.string().describe("short  title for the project"),
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.5,
    apiKey: process.env.GOOGLE_API_KEY,
    // maxRetries: 2,
})
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", prompt],
    [
        "human",
        `
    You are a professional in solar installations. 
   generate a solar installation title for the ptoject:{input}.
    Respond ONLY using the structured fields in the schema.`,
    ],
]);

const structuredLlm = model.withStructuredOutput(OutputSchema);
const chain = promptTemplate.pipe(structuredLlm);

// Run chain
export async function getTitle(input) {
    const res = await chain.invoke({
        input: input
    });

    console.log("respond:", res);
    // ✅ plain object
    return res
}
