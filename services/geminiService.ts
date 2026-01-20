
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyInsight = async (
  day: number, 
  monthName: string, 
  year: number, 
  gregorianDate: string,
  userLocation?: { lat: number; lng: number } | null,
  destinationAddress?: string
) => {
  try {
    let mapsPrompt = "";
    if (userLocation && destinationAddress) {
      mapsPrompt = `
        TRAVEL CONTEXT: The user is at [lat: ${userLocation.lat}, lng: ${userLocation.lng}] and going to ${destinationAddress}.
        Provide a travel suggestion and traffic summary in both languages.
      `;
    }

    const prompt = `
      You are a world-class bilingual cultural expert and theologian specializing in Persian Christian heritage and Ancient Persian traditions.
      Today is Jalali: ${day} ${monthName}, Gregorian: ${gregorianDate}.

      STRICT BILINGUAL REQUIREMENTS:
      1. Every single insight, prayer, and traffic update MUST be provided in both Persian (Farsi) and English.
      2. NEVER use placeholders like "No information available" or "اطلاعاتی در دسترس نیست". 
      3. If specific historical events for this exact day are not found, provide a beautiful, poetic reflection on the theme of the month, the season, or a general spiritual message relevant to the Persian Christian community.
      4. DO NOT use Finglish (Persian written in Latin/English alphabet). Use proper Persian script for Persian and professional English for English.
      5. The English part must be a faithful and elegant translation of the Persian part.

      CONTENT FOCUS:
      - Historical Insight: Christian saints, Church history, or Ancient Persian festivals.
      - Daily Prayer: Uplifting, poetic, and spiritual.
      - Travel: Practical and concise if location is provided. ${mapsPrompt}

      RESPONSE FORMAT (STRICT):
      [FA_INSIGHT]: (Detailed Persian insight/reflection)
      [EN_INSIGHT]: (Detailed English insight/reflection - same meaning)
      [FA_PRAYER]: (Poetic Persian prayer)
      [EN_PRAYER]: (Poetic English prayer - same meaning)
      [FA_TRAFFIC]: (Persian travel advice or leave empty if no location)
      [EN_TRAFFIC]: (English travel advice or leave empty if no location)
    `;
    
    // Using gemini-2.5-flash-preview as recommended for Maps grounding features.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.75,
        tools: userLocation ? [{ googleMaps: {} }] : [],
        // Safer spread syntax for the toolConfig
        ...(userLocation ? {
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.lat,
                longitude: userLocation.lng
              }
            }
          }
        } : {})
      },
    });

    const text = response.text || "";
    
    const getValue = (tag: string) => {
      const regex = new RegExp(`\\[${tag}\\]:(.*?)(?=\\[|$)`, 's');
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    let faInsight = getValue('FA_INSIGHT');
    let enInsight = getValue('EN_INSIGHT');
    let faPrayer = getValue('FA_PRAYER');
    let enPrayer = getValue('EN_PRAYER');
    let faTraffic = getValue('FA_TRAFFIC');
    let enTraffic = getValue('EN_TRAFFIC');

    // Extract grounding chunks for citations as required.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let links: string[] = [];
    if (groundingChunks) {
      links = groundingChunks
        .map((chunk: any) => chunk.maps?.uri || chunk.web?.uri)
        .filter((uri: string | undefined) => !!uri);
    }

    // Fallback logic
    return {
      insight: {
        fa: faInsight || "امروز روزی برای تامل در فیض خداوند و زیبایی خلقت است.",
        en: enInsight || "Today is a day to reflect on God's grace and the beauty of creation."
      },
      prayer: {
        fa: faPrayer || "خداوندا، ما را در نور خود نگاه دار و گام‌هایمان را استوار گردان.",
        en: enPrayer || "Lord, keep us in Your light and make our steps firm."
      },
      traffic: {
        fa: faTraffic,
        en: enTraffic,
        links: links
      }
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      insight: { 
        fa: "پوزش می‌طلبیم، خطایی در دریافت اطلاعات رخ داد. لطفاً لحظاتی دیگر تلاش کنید.", 
        en: "We apologize, an error occurred while retrieving insights. Please try again in a moment." 
      },
      prayer: { 
        fa: "برکت و آرامش خداوند با شما باد.", 
        en: "May the blessings and peace of the Lord be with you." 
      },
      traffic: { fa: "", en: "", links: [] }
    };
  }
};
