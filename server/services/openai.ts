import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface FashionRecommendation {
  title: string;
  details: string[];
  tips: string;
  tags: string[];
  imageUrl?: string;
}

export async function generateFashionRecommendations(preferences: {
  gender: string;
  bodyType: string;
  skinTone: string;
  occasion: string;
  season: string;
  colorPreferences?: string;
  stylePreferences?: string;
}): Promise<FashionRecommendation[]> {
  try {
    const prompt = `You are an expert fashion stylist with 15+ years of experience working with celebrities, fashion magazines, and personal clients. Your expertise includes body proportions, color theory, fabric knowledge, and seasonal styling.

Generate 3 detailed fashion recommendations for someone with these preferences:
- Gender: ${preferences.gender}
- Body Type: ${preferences.bodyType}
- Skin Tone: ${preferences.skinTone}
- Occasion: ${preferences.occasion}
- Season: ${preferences.season}
- Color Preferences: ${preferences.colorPreferences || "No specific preference"}
- Style Preferences: ${preferences.stylePreferences || "Open to suggestions"}

For each recommendation, provide:
1. A sophisticated, descriptive title for the outfit
2. Specific clothing items with exact details (fabric, cut, style, brand suggestions if relevant) - 5-7 items per outfit
3. CONCISE styling tips (2-3 sentences max) that include the most important advice:
   - Key body-flattering technique for their body type
   - Best color/fit choice for their skin tone and occasion
   - One essential styling secret or proportional tip
4. Relevant style tags

IMPORTANT: Keep styling tips brief but impactful. Focus on the most crucial advice like:
- "High-waisted bottoms create an hourglass silhouette for your body type"
- "Cool blues complement your skin tone perfectly"
- "Tuck just the front for a flattering asymmetrical look"

Respond with a JSON object containing an array of recommendations with this exact structure:
{
  "recommendations": [
    {
      "title": "Sophisticated Outfit Title",
      "details": ["Specific item with fabric/cut details", "Another specific item", "etc"],
      "tips": "Highly detailed, professional styling advice with specific techniques and reasoning",
      "tags": ["occasion", "season", "style", "bodytype"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional fashion stylist and personal shopper. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Generate images for each recommendation
    const recommendationsWithImages = await Promise.all(
      result.recommendations.map(async (rec: FashionRecommendation) => {
        try {
          const imagePrompt = `Hyper-realistic fashion photography: Professional model wearing a complete ${preferences.gender} outfit for ${preferences.occasion} in ${preferences.season}. Featured items: ${rec.details.join(', ')}. Style: ${preferences.stylePreferences || 'contemporary and polished'}. Model has ${preferences.bodyType} body type and ${preferences.skinTone} skin tone. Ultra-realistic details, perfect fabric textures, natural lighting, clean white studio background. High-resolution fashion editorial quality, photorealistic rendering showing exact fit and styling. Sharp focus, professional camera quality, lifelike skin and fabric textures.`;
          
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: imagePrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          });

          return {
            ...rec,
            imageUrl: imageResponse.data[0].url
          };
        } catch (imageError) {
          console.error("Error generating image for recommendation:", imageError);
          // Return recommendation without image if image generation fails
          return rec;
        }
      })
    );

    return recommendationsWithImages;
  } catch (error) {
    console.error("Error generating fashion recommendations:", error);
    throw new Error("Failed to generate fashion recommendations. Please try again.");
  }
}
