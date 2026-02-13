import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `Gợi ý 5-8 phim. Trả lời tiếng Việt. Mỗi phim format: [MOVIE]tên phim|lý do ngắn[/MOVIE]. Dùng tên phổ biến tại VN.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-lite',
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
        temperature: 0.8,
        maxOutputTokens: 800,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('AI Recommend Error:', error);

    const errorMessage = error.message || '';
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
      const retryMatch = errorMessage.match(/retry in (\d+)/i);
      const retrySeconds = retryMatch ? parseInt(retryMatch[1]) : 60;
      return Response.json(
        { error: `⏳ AI đang bận, vui lòng thử lại sau ${retrySeconds} giây. (Free tier giới hạn số lần gọi)` },
        { status: 429 }
      );
    }

    return Response.json(
      { error: error.message || 'Có lỗi xảy ra với AI. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
