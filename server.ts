import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initializing the server-side Gemini client with proper User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Using gemini-3.5-flash for fast and robust mobile layout conversion
const modelName = 'gemini-3.5-flash';

app.post('/api/convert', async (req, res) => {
  try {
    const { sourceCode, fileType, fileName, customPrompt } = req.body;
    if (!sourceCode) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    const systemInstruction = 
      "You are an expert mobile developer specializing in Android, Jetpack Compose, Kotlin, Swift, and React Native.\n" +
      "Your objective is to help developers migrate UI declarations from other frameworks (e.g., React, plain Android XML layouts, UIKit, older Kotlin/Java Android Views) into highly optimized Jetpack Compose components in Kotlin.\n" +
      "Keep all Compose components modern, using proper state variables (remember/mutableStateOf), modifier chains, and responsive scaling.\n" +
      "You must ALWAYS return response strictly in valid JSON format aligning with the schema specified.";

    let prompt = `Convert the following code into Jetpack Compose (Kotlin).
File Name: ${fileName || 'Unnamed File'}
File Type: ${fileType || 'Auto-detect'}

Source Code:
\`\`\`
${sourceCode}
\`\`\``;

    if (customPrompt) {
      prompt += `\n\nAdditional Instruction: ${customPrompt}`;
    }

    prompt += `\n\nGenerate a JSON response that complies EXACTLY with the schemas below. Do not wrap with markdown code fences except for the JSON format. The response must be a single JSON object with these keys:
{
  "convertedCode": "the complete Kotlin Jetpack Compose code with standard imports, @Composable annotation, and optimal layout architecture",
  "dependencies": ["list of implementation build.gradle dependencies in double quotes, e.g. \\"androidx.compose.ui:ui:1.5.0\\""],
  "checklist": ["checkbox list of steps/tasks for the user to verify the converter results"],
  "explanation": "concise explanation of design mapped elements (e.g., Column mapped from div/LinearLayout), state transformation, and UX suggestions in markdown format"
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received an empty response from Gemini.');
    }

    // Try parsing the text to guarantee its validity
    let parsedResult;
    try {
      parsedResult = JSON.parse(text.trim());
    } catch (parseErr) {
      // Fallback: search for first '{' and last '}' if model returned visual JSON inside markdown code blocks
      const cleanText = text.trim();
      const firstCurly = cleanText.indexOf('{');
      const lastCurly = cleanText.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1) {
        parsedResult = JSON.parse(cleanText.substring(firstCurly, lastCurly + 1));
      } else {
        throw parseErr;
      }
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error during code conversion:', error);
    res.status(500).json({
      error: error.message || 'Failed to convert code with Gemini API.'
    });
  }
});

// Configure static hosting for SPA in production or Vite integration middleware in dev
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // ESM dynamic import to prevent bundling Vite in production server
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`[Server] Active & listening on http://0.0.0.0:${port}`);
});
