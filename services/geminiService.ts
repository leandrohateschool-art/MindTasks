import { GoogleGenAI, Type } from "@google/genai";
import { AIBSuggestion, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const breakdownTask = async (taskTitle: string): Promise<AIBSuggestion> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Break down the task "${taskTitle}" into 3-5 actionable, concrete subtasks. Also suggest a priority level based on urgency implyed by the text, and a rough estimated time string (e.g. '2 hours').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable subtasks",
            },
            prioritySuggestion: {
              type: Type.STRING,
              enum: ["low", "medium", "high"],
              description: "Suggested priority level",
            },
            estimatedTime: {
              type: Type.STRING,
              description: "Estimated time to complete the parent task",
            },
          },
          required: ["subtasks", "prioritySuggestion"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIBSuggestion;
  } catch (error) {
    console.error("Error breaking down task:", error);
    // Fallback if AI fails
    return {
      subtasks: [],
      prioritySuggestion: 'medium',
      estimatedTime: 'Unknown'
    };
  }
};
