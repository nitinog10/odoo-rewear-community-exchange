import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface OutfitSuggestion {
  itemId: string;
  matchScore: number;
  reasoning: string;
}

export interface StyleAnalysis {
  suggestions: OutfitSuggestion[];
  reasoning: string;
  colorCompatibility: string;
  styleNotes: string;
}

export async function analyzeOutfitCompatibility(
  baseItem: any,
  availableItems: any[]
): Promise<StyleAnalysis> {
  try {
    const prompt = `
You are a professional fashion stylist and color theory expert. Analyze the base item and suggest the best matching items from the available options.

Base Item:
- Title: ${baseItem.title}
- Type: ${baseItem.type}
- Category: ${baseItem.category}
- Color: ${baseItem.color}
- Brand: ${baseItem.brand || 'Unknown'}
- Description: ${baseItem.description || 'No description'}

Available Items to Match:
${availableItems.map((item, index) => `
${index + 1}. ID: ${item.id}
   Title: ${item.title}
   Type: ${item.type}
   Category: ${item.category}
   Color: ${item.color}
   Brand: ${item.brand || 'Unknown'}
   Description: ${item.description || 'No description'}
`).join('\n')}

Please analyze color theory, seasonal compatibility, style cohesion, and current fashion trends. Provide suggestions in JSON format:

{
  "suggestions": [
    {
      "itemId": "item_id_here",
      "matchScore": 85,
      "reasoning": "Detailed explanation of why this item matches well"
    }
  ],
  "reasoning": "Overall styling philosophy and approach",
  "colorCompatibility": "Analysis of color harmony and contrast",
  "styleNotes": "Additional styling tips and recommendations"
}

Focus on:
- Color theory and complementary colors
- Seasonal appropriateness
- Style cohesion (casual, formal, business, etc.)
- Body type flattering combinations
- Current fashion trends
- Versatility and wearability

Provide up to 5 best matches with scores above 70.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional fashion stylist with expertise in color theory, seasonal styling, and sustainable fashion. Provide detailed, actionable styling advice in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      suggestions: result.suggestions || [],
      reasoning: result.reasoning || "No analysis available",
      colorCompatibility: result.colorCompatibility || "No color analysis available",
      styleNotes: result.styleNotes || "No style notes available"
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error("Failed to analyze outfit compatibility: " + (error as Error).message);
  }
}

export async function generateStyleRecommendations(
  userProfile: any,
  userItems: any[],
  seasonalTrends: string = "current"
): Promise<{
  outfits: Array<{
    name: string;
    description: string;
    items: string[];
    occasion: string;
    seasonality: string;
  }>;
  personalizedTips: string[];
}> {
  try {
    const prompt = `
You are a personal fashion stylist creating personalized outfit recommendations for a user.

User Profile:
- Style preferences: ${JSON.stringify(userProfile.stylePreferences || {})}
- Available items: ${userItems.length}

User's Wardrobe:
${userItems.map((item, index) => `
${index + 1}. ${item.title} (${item.type}, ${item.color}, ${item.category})
`).join('\n')}

Create 3-5 complete outfit combinations using the user's existing items. Consider:
- Seasonal trends: ${seasonalTrends}
- Color coordination and contrast
- Occasion appropriateness
- Style cohesion
- Versatility

Respond in JSON format:
{
  "outfits": [
    {
      "name": "Casual Weekend",
      "description": "Comfortable yet stylish for relaxed activities",
      "items": ["item_id_1", "item_id_2", "item_id_3"],
      "occasion": "Casual",
      "seasonality": "All seasons"
    }
  ],
  "personalizedTips": [
    "Tip 1 based on user's style",
    "Tip 2 for improving their wardrobe"
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a personal fashion stylist specializing in sustainable fashion and wardrobe optimization. Create practical, wearable outfit combinations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      outfits: result.outfits || [],
      personalizedTips: result.personalizedTips || []
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error("Failed to generate style recommendations: " + (error as Error).message);
  }
}

export async function analyzeItemForCategorization(
  title: string,
  description: string,
  imageBase64?: string
): Promise<{
  suggestedCategory: string;
  suggestedType: string;
  suggestedColor: string;
  suggestedTags: string[];
  confidence: number;
}> {
  try {
    const messages: any[] = [
      {
        role: "system",
        content: "You are a fashion categorization expert. Analyze clothing items and suggest appropriate categories, types, colors, and tags."
      }
    ];

    const textContent = `
Analyze this clothing item and suggest categorization:

Title: ${title}
Description: ${description}

Categories: Men, Women, Kids, Unisex
Types: Shirt, T-Shirt, Blouse, Dress, Pants, Jeans, Shorts, Skirt, Jacket, Coat, Sweater, Hoodie, Shoes, Boots, Sneakers, Sandals, Accessories, Belt, Bag, Hat, Scarf, Jewelry
Colors: Black, White, Gray, Navy, Blue, Red, Pink, Green, Yellow, Orange, Purple, Brown, Beige, Cream, Multicolor
Tags: Casual, Formal, Business, Vintage, Designer, Sustainable, Handmade, Luxury, Sporty, Bohemian, Minimalist, Trendy

Respond in JSON format:
{
  "suggestedCategory": "Women",
  "suggestedType": "Dress",
  "suggestedColor": "Blue",
  "suggestedTags": ["Casual", "Summer"],
  "confidence": 0.85
}
`;

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: textContent
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: textContent
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      suggestedCategory: result.suggestedCategory || "Unisex",
      suggestedType: result.suggestedType || "Shirt",
      suggestedColor: result.suggestedColor || "Multicolor",
      suggestedTags: result.suggestedTags || [],
      confidence: result.confidence || 0.5
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error("Failed to analyze item for categorization: " + (error as Error).message);
  }
}
