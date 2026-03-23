// Type definition for the analysis result from Gemini API
interface ResumeAnalysis {
  atsScore: number;           // Score from 0-100
  atsDetails: string;         // Explanation of the score
  suggestions: string[];      // Tips to improve resume
  updates: string[];          // Specific changes to make
  timestamp: Date;            // When analysis was done
}

// Step 1: Convert PDF file to base64 format (required by Gemini API)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Read the file as a data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      // Result looks like: "data:application/pdf;base64,ABC123DEF456..."
      const result = reader.result as string;
      // Extract only the base64 part (remove the "data:application/pdf;base64," prefix)
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

// Step 2: Main function to analyze resume with Gemini API
export const analyzeResumeWithGemini = async (file: File): Promise<ResumeAnalysis> => {
  try {
    // Convert PDF to base64 first
    const fileData = await fileToBase64(file);
    
    // Create the instruction prompt for Gemini
    const prompt = `You are a resume expert. Analyze this resume and provide:
1. ATS score (0-100) - how well ATS systems can read it
2. ATS Details - why you gave this score
3. 5-7 suggestions for improvement
4. 3-5 specific updates to make

Return ONLY valid JSON:
{
  "atsScore": <number>,
  "atsDetails": "<string>",
  "suggestions": ["<string>"],
  "updates": ["<string>"]
}`;

    // Build the API request URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY as string}`;
    
    // Send the PDF and prompt to Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },              // Send the instructions
              {                                // Send the PDF file
                inlineData: {
                  mimeType: file.type || 'application/pdf',
                  data: fileData,
                },
              },
            ],
          },
        ],
      }),
    });

    // Check if API call was successful
    if (!response.ok) {
      throw new Error('Gemini API failed to analyze resume');
    }

    // Parse the response from Gemini
    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No response received from Gemini API');
    }

    // Extract JSON from the response (it's usually wrapped in text)
    // Look for pattern like { ... }
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in Gemini response');
    }

    // Parse the JSON string into an object
    const analysis = JSON.parse(jsonMatch[0]);

    // Return the structured result
    return {
      atsScore: analysis.atsScore || 0,
      atsDetails: analysis.atsDetails || '',
      suggestions: analysis.suggestions || [],
      updates: analysis.updates || [],
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};
