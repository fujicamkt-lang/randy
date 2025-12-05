import { GoogleGenAI } from "@google/genai";

export const generateGameAssets = async (): Promise<{ background: string; prize: string }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Parallel generation for speed
    const [bgResponse, prizeResponse] = await Promise.all([
      // 1. Generate Background: 45-degree isometric/top-down view
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: "Classic 1950s MGM animation style background of a cozy Christmas living room. 45-degree isometric high-angle view looking down at a wooden floor with a festive rug in the center. The center of the image must be empty floor space to place gift boxes. Warm lighting, fireplace glow in the background, hand-painted gouache texture." }],
        },
        config: { imageConfig: { aspectRatio: '16:9' } }
      }),
      // 2. Generate Prize: The Meltykiss Chocolate in cartoon style
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: "Hand-painted cartoon illustration of a box of Meiji Meltykiss chocolates (Snow Kiss), vintage animation style, flat cel shading, compatible with Tom and Jerry art style, festive, delicious, no background, isolated object." }],
        },
        config: { imageConfig: { aspectRatio: '1:1' } }
      })
    ]);

    const getBase64 = (response: any) => {
      // Robust checking for image parts
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    };

    const background = getBase64(bgResponse);
    const prize = getBase64(prizeResponse);

    if (!background || !prize) {
      console.error("Missing asset data in response");
      throw new Error("生成游戏素材失败，模型未返回图像，请重试。");
    }

    return { background, prize };
  } catch (error) {
    // Log string representation to avoid circular structure issues in some consoles
    console.error("Gemini Generation Error:", String(error));
    // Re-throw with user friendly message
    throw new Error("生成游戏素材失败，请检查网络或稍后重试。");
  }
};