
export const getMedicalOrientation = async (symptoms: string) => {
  try {
    const response = await fetch('/api/ai/medical-orientation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    return await response.json();
  } catch (error) {
    console.error("AI client error:", error);
    return null;
  }
};

export const getArtisanDiagnosis = async (problemDescription: string) => {
  try {
    const response = await fetch('/api/ai/artisan-diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemDescription })
    });
    return await response.json();
  } catch (error) {
    console.error("AI client error:", error);
    return null;
  }
};

export const getDriverChatResponse = async (name: string, message: string) => {
  try {
    const response = await fetch('/api/ai/chat-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI client error:", error);
    return "Désolé, je ne peux pas répondre pour le moment.";
  }
};

export const getNeighborhoodFromCoords = async (lat: number, lng: number) => {
  try {
    const response = await fetch('/api/ai/neighborhood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    });
    const data = await response.json();
    return data.neighborhood;
  } catch (error) {
    console.error("AI client error:", error);
    return "Libreville";
  }
};

export const negotiatePrice = async (currentPrice: number, offer: number, road: string, weather: string, passengers?: number, hasLuggage?: boolean) => {
  try {
    const response = await fetch('/api/ai/negotiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPrice, offer, road, weather, passengers, hasLuggage })
    });
    return await response.json();
  } catch (error) {
    console.error("AI client error:", error);
    return { reply: "On y va.", finalPrice: offer };
  }
};

export const predictNextDirection = async (history: string[]) => {
  try {
    const response = await fetch('/api/ai/predict-direction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history })
    });
    const data = await response.json();
    return data.prediction;
  } catch (error) {
    console.error("AI client error:", error);
    return "Aéroport Léon Mba";
  }
};
