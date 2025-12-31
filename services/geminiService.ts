import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { RoastResult, SocialAnalysis, ProductionGuide, AutoEngineReport } from "../types";

// Helper to get a fresh client instance (important for API key changes in Veo flow)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs a "Roast" of the provided URL using Gemini 3 Pro with Thinking.
 */
export const roastUrl = async (url: string): Promise<RoastResult> => {
  const ai = getAiClient();
  
  const prompt = `
    Analyze the website URL: ${url}. 
    Act as a brutal, high-tech sales engineer. 
    1. Estimate a "Diagnostic Score" from 0-100 based on modern web standards.
    2. Identify 3 critical, specific errors. You MUST include simulated specific metrics:
       - Error 1 (Speed): Cite estimated LCP (e.g., 4.2s) or FID.
       - Error 2 (Mobile UX): Cite mobile-friendliness or tap target sizes.
       - Error 3 (Conversion): Cite CTA visibility or form friction.
    3. Provide a 1-sentence "brutal truth" summary.
    
    Return purely JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      errors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      summary: { type: Type.STRING }
    },
    required: ["score", "errors", "summary"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 1024 }, // Use thinking for deep analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as RoastResult;
  } catch (error) {
    console.error("Roast failed", error);
    // Fallback if AI fails
    return {
      score: 42,
      errors: ["Speed: LCP > 5.2s (Critical)", "Mobile: Viewport overflow & 12px tap targets", "Conversion: CTA below fold (0.4% CTR risk)"],
      summary: "This site is leaking conversion traffic like a sieve."
    };
  }
};

/**
 * Analyzes the briefing data to simulate OSINT enrichment.
 */
export const analyzeBriefing = async (goal: string, socials: string, contact: string): Promise<SocialAnalysis> => {
  const ai = getAiClient();
  
  const prompt = `
    You are an OSINT (Open Source Intelligence) expert for a sales orchestrator.
    User Goal: ${goal}
    Social Links provided: ${socials}
    Contact Info: ${contact}

    1. Simulate/Estimate "Public Data" enrichment based on the inputs (infer probable reach/engagement for this type of business).
    2. Recommend the single best contact method (WhatsApp or Email) based on the goal (e.g., Sales -> WhatsApp for speed, Brand -> Email for detail).

    Return purely JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      estimatedReach: { type: Type.STRING, description: "e.g. '15k-25k estimated followers'" },
      engagementScore: { type: Type.STRING, description: "e.g. 'High (4.8%)'" },
      recommendedContact: { type: Type.STRING, enum: ["WhatsApp", "Email"] },
      reasoning: { type: Type.STRING }
    },
    required: ["estimatedReach", "engagementScore", "recommendedContact", "reasoning"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Faster model for this step
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as SocialAnalysis;
  } catch (e) {
    return {
      estimatedReach: "Data Unavailable",
      engagementScore: "Low",
      recommendedContact: "Email",
      reasoning: "Defaulting to formal channel due to missing signal."
    };
  }
};

/**
 * Generates the Production Supervisor Guide for the human agent.
 */
export const generateProductionGuide = async (url: string, goal: string, analysis?: SocialAnalysis): Promise<ProductionGuide> => {
  const ai = getAiClient();

  const prompt = `
    ROLE: SNAP 2026 Production Supervisor.
    CONTEXT: Client URL: ${url}. Goal: ${goal}. Analysis: ${JSON.stringify(analysis || {})}.
    TASK: The client has paid. The AI Draft is ready. A Human Agent has 24 hours to finalize.
    
    Generate a JSON object with:
    1. "missingItems": A checklist of 3-4 likely missing assets or risks for this specific site/industry (e.g., 'High-res transparent logo', 'Terms of Service text').
    2. "refinementPrompts": A list of 4 specific, actionable prompts for the Human Agent to use with their AI Coding Assistant to finalize the build.
       - Include categories: "Asset Gen" (Midjourney/DALL-E prompt for missing images), "Mobile Fix" (Tailwind specifics), "SEO Injection" (Keywords), "DNS Prep".

    Return purely JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      missingItems: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      refinementPrompts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            prompt: { type: Type.STRING }
          }
        }
      }
    },
    required: ["missingItems", "refinementPrompts"]
  };

  try {
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: prompt,
       config: {
         responseMimeType: 'application/json',
         responseSchema: schema
       }
     });

     const text = response.text;
     if (!text) throw new Error("No response");
     return JSON.parse(text) as ProductionGuide;
  } catch (e) {
    return {
      missingItems: ["Verify Logo Quality", "Check Mobile Padding", "Test Contact Forms"],
      refinementPrompts: [
        { category: "Asset Gen", prompt: "Create a photorealistic hero image for..." },
        { category: "Mobile Fix", prompt: "Ensure all p-12 become p-4 on mobile..." }
      ]
    };
  }
};

/**
 * Generates the full Auto-Engine Report (Audit + 3 Design Options).
 */
export const generateAutoEngineReport = async (url: string, goal: string, analysis?: SocialAnalysis, roast?: RoastResult): Promise<AutoEngineReport> => {
  const ai = getAiClient();

  const prompt = `
    ROLE: SNAP 2026 Auto-Engine.
    CONTEXT: Client URL: ${url}. Goal: ${goal}. Analysis: ${JSON.stringify(analysis || {})}. Roast Score: ${roast?.score || 50}.
    TASK: Generate a comprehensive "Instant Output" report for the Human Agent.
    
    OUTPUT FORMAT (JSON):
    1. "audit":
       - "criticalFailures": List 3 specific failures starting with "Critical Failure - [Topic]:" (e.g., "Critical Failure - Mobile Responsiveness: ...").
       - "conversionOpportunity": A specific opportunity starting with "Conversion Opportunity:".
    2. "options": A list of 3 Design Options strictly following these personas:
       - Option A: "The Converter" (Gemini Logic) -> Focus: Direct Lead Gen / Sales.
       - Option B: "The Brand Builder" (GPT-4 Logic Style) -> Focus: Trust / Luxury / Story.
       - Option C: "The Utility" (Anthropic Logic Style) -> Focus: Efficiency / Frictionless / Clean.
       
       For each option include:
       - "name": string (e.g. "The Converter")
       - "structure": string (e.g., "Hero -> Benefit Grid -> ...")
       - "tone": string
       - "focus": string
       - "feature": string (Specific feature description)

    Return purely JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      audit: {
        type: Type.OBJECT,
        properties: {
          criticalFailures: { type: Type.ARRAY, items: { type: Type.STRING } },
          conversionOpportunity: { type: Type.STRING }
        }
      },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            structure: { type: Type.STRING },
            tone: { type: Type.STRING },
            focus: { type: Type.STRING },
            feature: { type: Type.STRING }
          }
        }
      }
    },
    required: ["audit", "options"]
  };

  try {
     const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Stronger reasoning for strategy
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
     });

     const text = response.text;
     if (!text) throw new Error("No response");
     return JSON.parse(text) as AutoEngineReport;
  } catch (e) {
     console.error("AutoEngine Report Error", e);
     // Fallback
     return {
        audit: {
            criticalFailures: ["Critical Failure - Mobile Viewport broken", "Critical Failure - LCP > 4s", "Critical Failure - CTA Low Contrast"],
            conversionOpportunity: "Sticky Header CTA"
        },
        options: [
            { name: "The Converter", structure: "Hero -> Form", tone: "Urgent", focus: "Leads", feature: "Sticky Button" },
            { name: "The Brand Builder", structure: "Video -> Gallery", tone: "Premium", focus: "Trust", feature: "Social Grid" },
            { name: "The Utility", structure: "Menu -> Map", tone: "Clean", focus: "Speed", feature: "One-Tap Book" }
        ]
     };
  }
};

/**
 * Generates a concept image using Gemini 3 Pro Image.
 */
export const generateConceptImage = async (
  prompt: string, 
  aspectRatio: string = "16:9", 
  size: "1K" | "2K" | "4K" = "1K"
): Promise<string> => {
  // Ensure Key Selection for Gemini 3 Pro Image
  if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error", error);
    throw error;
  }
};

/**
 * Edits an existing image using Gemini 2.5 Flash Image (Nano Banana).
 */
export const editImage = async (
  base64Image: string, 
  editPrompt: string
): Promise<string> => {
  const ai = getAiClient();
  
  // Remove data URL prefix if present for the API call
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png'
            }
          },
          { text: editPrompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned");
  } catch (error) {
    console.error("Image Edit Error", error);
    throw error;
  }
};

/**
 * Generates a video using Veo.
 */
export const generateVideo = async (
  prompt: string, 
  imageBytes?: string
): Promise<string> => {
  // Ensure Key Selection for Veo
  if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // Re-instantiate to pick up the new key
  const ai = getAiClient();
  const cleanBase64 = imageBytes ? imageBytes.replace(/^data:image\/(png|jpeg|webp);base64,/, "") : undefined;

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: cleanBase64 ? {
        imageBytes: cleanBase64,
        mimeType: 'image/png'
      } : undefined,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");
    
    // Fetch the actual video bytes
    const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await videoRes.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo Gen Error", error);
    throw error;
  }
};

/**
 * Chatbot Interaction
 */
export const chatWithBot = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history as any,
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};

/**
 * Fast responses for UI
 */
export const getFastResponse = async (prompt: string) => {
    const ai = getAiClient();
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        contents: prompt
    });
    return result.text;
}

/**
 * Generates full HTML/Tailwind landing page code based on mode.
 */
export const generateLivePreview = async (url: string, goal: string, mode: 'A' | 'B'): Promise<string> => {
    const ai = getAiClient();
    
    const context = `Client URL: ${url}. Goal: ${goal}.`;
    
    const visualSystem = mode === 'A' 
      ? `MODE A: "THE STITCH" (Corporate/Trust).
         - Background: Pure White (#FFFFFF) or slate-50.
         - Typography: Inter/Helvetica (Sans-serif). High readability.
         - Layout: Symmetric, rounded corners (rounded-2xl), soft drop shadows (shadow-xl), plenty of whitespace (p-12).
         - Colors: Slate-900 text, Blue-600 accents.
         - Vibe: Apple, Stripe, SaaS Unicorn.`
      : `MODE B: "THE ANTIGRAVITY" (Disruptive).
         - Background: Deep Black (#000000) or neutral-950.
         - Typography: Monospace mixed with Oswald/Impact (Display). 
         - Layout: Asymmetric, broken grids, sharp corners (rounded-none), "Glitch" effects.
         - Colors: White text, Neon Lime (#ccff00) or Hot Pink (#ff00ff) accents.
         - Vibe: Cyberpunk, High-Fashion, Underground.`;

    const prompt = `
      You are SNAP 2026 Senior UI/UX Architect (The Engine).
      Task: Generate the FULL HTML/TAILWIND code for a high-conversion landing page.
      
      CONTEXT: ${context}
      VISUAL SYSTEM: ${visualSystem}
      
      REQUIREMENTS:
      1. Return a SINGLE, VALID HTML string starting with <!DOCTYPE html>.
      2. Use <script src="https://cdn.tailwindcss.com"></script> in the head.
      3. For Mode B, you can use google fonts in head: <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Space+Mono&display=swap" rel="stylesheet">.
      4. Ensure the design is fully responsive and looks professional.
      5. Include sections: Hero (with headline), Value Props (grid), Pricing or Features, and a footer.
      6. Do NOT markdown format the output (no \`\`\`html). Just the raw code.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2048 }, // Think hard about the design
            }
        });
        
        let code = response.text || "";
        // Cleanup markdown if present
        code = code.replace(/```html/g, '').replace(/```/g, '');
        return code;
    } catch (e) {
        console.error("Code gen failed", e);
        throw e;
    }
}