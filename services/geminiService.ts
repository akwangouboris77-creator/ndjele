
import { GoogleGenAI, Type } from "@google/genai";

const getSafeText = (response: any): string => {
  try {
    return (response.text || "").trim();
  } catch (e) {
    return "";
  }
};

export const getMedicalOrientation = async (symptoms: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es un assistant médical d'orientation au Gabon. Un patient décrit ses symptômes : "${symptoms}".
    Analyse la demande et réponds en JSON avec :
    1. "specialty" : la catégorie de médecin recommandée parmi : generaliste, pediatre, gynecologue, dentiste, ophtalmo, urologue, diabetologue, urgence.
    2. "advice" : un conseil bref de premier secours (ex: boire de l'eau, rester allongé).
    3. "urgencyLevel" : un score de 1 à 5 (5 étant une urgence vitale).
    4. "message" : un message d'orientation bienveillant.
    IMPORTANT : Ajoute toujours une mention que ceci n'est pas un diagnostic final et qu'il faut consulter.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          specialty: { type: Type.STRING },
          advice: { type: Type.STRING },
          urgencyLevel: { type: Type.NUMBER },
          message: { type: Type.STRING }
        },
        required: ["specialty", "advice", "urgencyLevel", "message"]
      }
    }
  });
  
  const text = getSafeText(response);
  return text ? JSON.parse(text) : null;
};

export const getArtisanDiagnosis = async (problemDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es un expert en maintenance domestique au Gabon. Un client décrit son problème : "${problemDescription}".
    Analyse la demande et réponds en JSON avec :
    1. "category" : le métier nécessaire parmi : plomberie, electricite, froid, maconnerie, menuiserie, carrelage, menage, nettoyage, charpenterie, elagage, mecanique.
    2. "advice" : un conseil bref de sécurité.
    3. "priceRange" : une estimation du prix à Libreville.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          advice: { type: Type.STRING },
          priceRange: { type: Type.STRING }
        },
        required: ["category", "advice", "priceRange"]
      }
    }
  });
  
  const text = getSafeText(response);
  return text ? JSON.parse(text) : null;
};

export const getDriverChatResponse = async (name: string, message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es ${name}, prestataire au Gabon (Libreville). Un client te dit : "${message}". Réponds court, professionnel et chaleureux (style local).`,
  });
  return getSafeText(response);
};

export const getNeighborhoodFromCoords = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Identifie le quartier à Libreville pour : Lat ${lat}, Lng ${lng}. Format court.`,
    config: { tools: [{ googleMaps: {} }] },
  });
  return getSafeText(response) || "Libreville";
};

export const negotiatePrice = async (currentPrice: number, offer: number, road: string, weather: string, passengers?: number, hasLuggage?: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Chauffeur à Libreville. Prix de base estimé: ${currentPrice}. Client propose: ${offer}. 
    Contexte supplémentaire: Route: ${road}, Météo: ${weather}, Passagers: ${passengers || 1}, Bagages: ${hasLuggage ? 'Oui' : 'Non'}.
    Réponds en JSON: reply (style gabonais, accepte ou négocie avec humour) et finalPrice (nombre).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING },
          finalPrice: { type: Type.NUMBER }
        },
        required: ["reply", "finalPrice"]
      }
    }
  });
  const text = getSafeText(response);
  return text ? JSON.parse(text) : { reply: "On y va.", finalPrice: offer };
};

export const predictNextDirection = async (history: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es une IA de logistique à Libreville. Voici l'historique des dernières destinations d'un taxi : ${history.join(', ')}. 
    En te basant sur les habitudes de transport locales au Gabon et cet historique, prédis la prochaine destination la plus probable.
    Réponds uniquement avec le nom du quartier/lieu (ex: Aéroport, Owendo, Louis).`,
  });
  return getSafeText(response) || "Aéroport Léon Mba";
};
