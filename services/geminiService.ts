import { GoogleGenAI, Type } from "@google/genai";
import { Question, SyllabusTopic } from "../types";

// FIX: Initialize the GoogleGenAI client as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    english_question: { type: Type.STRING, description: "The question in English." },
    urdu_question: { type: Type.STRING, description: "The question in Urdu (Nasta'liq script)." },
    kannada_question: { type: Type.STRING, description: "The question in Kannada." },
    options: {
      type: Type.OBJECT,
      properties: {
        english_options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Four options in English." },
        urdu_options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The same four options in Urdu." },
        kannada_options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The same four options in Kannada." },
      },
      required: ['english_options', 'urdu_options', 'kannada_options']
    },
    correct_answer_index: { type: Type.INTEGER, description: "The 0-based index of the correct answer." },
    repeated_years: { type: Type.STRING, description: "Mention years if question was repeated in KARTET, otherwise 'New (High-Yield)'." }
  },
  required: ['english_question', 'urdu_question', 'kannada_question', 'options', 'correct_answer_index', 'repeated_years']
};

export const generateQuestions = async (topic: SyllabusTopic, numberOfQuestions: number = 5): Promise<Question[]> => {
  // Use gemini-flash-lite-latest for faster, low-latency responses.
  const model = "gemini-flash-lite-latest";

  const prompt = `
    **Role:** You are an expert KARTET exam analyst and question creator. Your mission is to generate a highly effective practice test.

    **Primary Goal:** Create a set of exactly ${numberOfQuestions} multiple-choice questions that are maximally relevant and predictive for the upcoming KARTET 2025 exam, based on the provided syllabus.

    **Syllabus Details:**
    *   **Paper:** ${topic.paper}
    *   **Subject:** ${topic.subject}
    *   **Topic:** ${topic.topic}
    *   **Content:** ${topic.content}

    **Question Sourcing Hierarchy (Strictly follow this order):**
    1.  **Tier 1 (Highest Priority - Past Papers):** Your first and foremost duty is to find and include actual questions from previous KARTET exams that are directly relevant to the syllabus. Prioritize these above all else. For each of these questions, you MUST accurately set the \`repeated_years\` field to the year(s) it appeared (e.g., "2019", "2018, 2020").
    2.  **Tier 2 (High Priority - Predictive Questions):** If you cannot find enough past paper questions to meet the ${numberOfQuestions} quota, you must generate NEW, high-yield questions. These questions should be crafted to test the most critical concepts from the syllabus and be highly predictive of what might appear on the KARTET 2025 exam. For these new, important questions, you MUST set the \`repeated_years\` field to "New (High-Yield)".

    **Mandatory Rules:**
    1.  **NO DUPLICATES:** All ${numberOfQuestions} questions in your response must be unique.
    2.  **UNCOMPROMISING LANGUAGE PURITY:** This is a non-negotiable rule.
        *   Provide each question and its four options in three separate, pure languages: English, Urdu (in Nasta'liq script), and Kannada.
        *   **NO MIXING:** Do not mix words from different languages within a single question or option. A Kannada question must contain ONLY Kannada words. An Urdu question must contain ONLY Urdu words.
        *   **FORBIDDEN LANGUAGES:** You are strictly forbidden from using any words from Tamil, Telugu, Hindi, or any language other than the three specified. Any response containing mixed languages is a failure.
        *   Translations must be perfect and contextually accurate for an exam.
    3.  **CORRECT STRUCTURE:** Every question must have exactly four options. The \`correct_answer_index\` must be the correct 0-based index of the right answer.
    4.  **ADHERE TO SCHEMA:** The final output must be a JSON array of question objects, strictly following the provided JSON schema. Do not deviate from the structure.
  `;

  try {
    // FIX: Using ai.models.generateContent to query GenAI.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: questionSchema,
        },
        temperature: 0.8, // Slightly higher for more creative questions
      },
    });

    // FIX: Extracting text output directly from response.text property.
    const jsonString = response.text.trim();
    
    // Sometimes the model might still wrap the JSON in markdown, so we sanitize it.
    const sanitizedJsonString = jsonString.startsWith('```json\n')
      ? jsonString.substring(7, jsonString.length - 3)
      : jsonString;
      
    const questions: Question[] = JSON.parse(sanitizedJsonString);
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Generated content is not a valid array of questions.");
    }
    return questions;
  } catch (error) {
    console.error("Error generating questions from Gemini API:", error);
    throw new Error("Failed to generate questions. The AI model may be temporarily unavailable or the request was invalid. Please try again.");
  }
};