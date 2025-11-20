import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { GEO_NOTES } from "../constants";

export const generateQuiz = async (topic: string, count: number): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Constructing the prompt based on user selection
  let promptContext = `Generate a quiz of ${count} multiple choice questions based on the Geography notes provided below.`;
  
  if (topic !== "Vsa snov") {
    promptContext += `\n\nFOCUS STRICTLY ON THE CONTENT WITHIN THE SECTION: "${topic}". Do not include questions from other sections.`;
  } else {
    promptContext += `\n\nEnsure the questions cover different sections of the notes evenly.`;
  }

  promptContext += `
    \nIMPORTANT RULES FOR JSON GENERATION:
    1. The output must be in Slovenian language.
    2. The 'options' array must contain exactly 4 distinct strings.
    3. CRITICAL: Randomize the position of the correct answer within the 'options' array. 
    4. CRITICAL: The 'correctAnswerIndex' must correspond to the index (0, 1, 2, or 3) of the correct answer in your randomized list. DO NOT ALWAYS PUT THE CORRECT ANSWER AT INDEX 0.
    5. Provide a helpful explanation for why the answer is correct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${promptContext}
      
      NOTES DATA:
      ${GEO_NOTES}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["id", "questionText", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as Question[];
    } else {
        throw new Error("No data returned from Gemini");
    }

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback mock data if API fails, respecting the requested count
    return [
      {
        id: "fallback-1",
        questionText: "Kateri ovoj Zemlje predstavlja vodni ovoj?",
        options: ["Litosfera", "Atmosfera", "Hidrosfera", "Pedosfera"],
        correctAnswerIndex: 2,
        explanation: "Hidrosfera zajema vse vode na Zemlji: oceane, reke, jezera in led."
      },
      {
        id: "fallback-2",
        questionText: "Kaj povzroča premikanje litosferskih plošč?",
        options: ["Lunin privlak", "Konvekcijski tokovi v astenosferi", "Vrtenje Zemlje", "Sončno sevanje"],
        correctAnswerIndex: 1,
        explanation: "V astenosferi (zgornji del plašča) potekajo konvekcijski tokovi, ki premikajo plošče nad njo."
      },
      {
        id: "fallback-3",
        questionText: "Katera sila gradi in viša relief?",
        options: ["Eksogena (zunanja)", "Erozija", "Preperevanje", "Endogena (notranja)"],
        correctAnswerIndex: 3, 
        explanation: "Endogene sile izvirajo iz notranjosti Zemlje in gradijo relief (tektonika, vulkanizem)."
      }
    ].slice(0, count);
  }
};