export const callGeminiAPI = async (
  apiKey: string,
  selectedText: string,
  documentContext: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Instructions for AI Assistant: You are a helpful writing assistant. Respond directly with improved content only. Do not include explanations, introductions, or notes about what you did unless specifically asked. Focus solely on delivering the requested content transformation.
  
  ${
    selectedText
      ? 'Content to work with: """' + selectedText + '"""'
      : 'Context (for reference only): """' +
        documentContext.substring(0, 1000) +
        '"""'
  }
  
  Task: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates[0]?.content?.parts &&
      data.candidates[0].content.parts[0]?.text
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error: Failed to generate response. Please check your API key and try again.";
  }
};
