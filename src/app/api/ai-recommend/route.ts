import { NextRequest } from 'next/server';
import { searchMovies } from '@/services/actions';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b:free';

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về phim ảnh của TC Phim.

NHIỆM VỤ:
- Phân tích yêu cầu của người dùng và đề xuất từ khóa tìm kiếm phim.
- Chỉ trả lời bằng JSON, không giải thích gì thêm.

QUY TẮC:
1. Nếu người dùng chào hỏi hoặc hỏi không liên quan đến phim:
   Trả về: {"type":"chat","message":"<câu trả lời thân thiện, hướng dẫn họ hỏi về phim>"}

2. Nếu người dùng muốn tìm/gợi ý phim:
   Trả về: {"type":"search","keywords":["từ khóa 1","từ khóa 2",...],"message":"<mô tả ngắn về gợi ý>"}
   - keywords: mảng 3-6 từ khóa tên phim tiếng Việt phổ biến, phù hợp yêu cầu.
   - Ưu tiên tên phim chính xác nếu biết, nếu không thì dùng từ khóa thể loại/mô tả.
   - Ví dụ: 
       + yêu cầu "phim kinh dị hay" → keywords có thể là ["Quỷ Nhập Tràng","Tết Ở Làng Địa Ngục","Conjuring","Insidious","It"]
       + yêu cầu "phim hài" → keywords có thể là ["Gái Già Lắm Chiêu","Em Chưa 18","Cua Lại Vợ Bầu","Lật Mặt","Bố Già"]
       + yêu cầu phim hành động 

CHỈ TRẢ VỀ JSON, KHÔNG CÓ GÌ KHÁC.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
    }

    const aiResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'TC Phim',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
        plugins: [
          { id: 'web', max_results: 5 },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenRouter Error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return Response.json(
          { error: '⏳ AI đang bận, vui lòng thử lại sau 1 phút.' },
          { status: 429 }
        );
      }
      return Response.json(
        { error: 'Có lỗi xảy ra với AI. Vui lòng thử lại.' },
        { status: aiResponse.status }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const cleanContent = aiContent.replace(/```json?\s*/gi, '').replace(/```/g, '').trim();
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed) {
      console.log('AI parse failed, falling back to direct search with prompt:', prompt);
      const fallbackResult = await searchMovies(prompt, 10);
      const fallbackMovies = (fallbackResult?.items || []).map(movie => ({
        movie,
        keyword: prompt,
        cdnImage: fallbackResult?.APP_DOMAIN_CDN_IMAGE || '',
      }));

      return Response.json({
        type: 'search',
        message: fallbackMovies.length > 0
          ? `Đây là kết quả tìm kiếm cho "${prompt}":`
          : `Mình không tìm thấy phim phù hợp với "${prompt}". Thử từ khóa khác nhé!`,
        movies: fallbackMovies,
        cdnImage: fallbackResult?.APP_DOMAIN_CDN_IMAGE || '',
      });
    }

    if (parsed.type === 'chat') {
      return Response.json({
        type: 'chat',
        message: parsed.message,
        movies: [],
      });
    }

    if (parsed.type === 'search' && Array.isArray(parsed.keywords)) {
      const keywords: string[] = parsed.keywords.slice(0, 6);

      const searchResults = await Promise.all(
        keywords.map(async (keyword) => {
          const result = await searchMovies(keyword, 3);
          return {
            keyword,
            items: result?.items || [],
            cdnImage: result?.APP_DOMAIN_CDN_IMAGE || '',
          };
        })
      );

      const seen = new Set<string>();
      const movies: Array<{
        movie: any;
        keyword: string;
        cdnImage: string;
      }> = [];

      for (const result of searchResults) {
        for (const movie of result.items) {
          if (!seen.has(movie.slug)) {
            seen.add(movie.slug);
            movies.push({
              movie,
              keyword: result.keyword,
              cdnImage: result.cdnImage,
            });
          }
        }
      }

      return Response.json({
        type: 'search',
        message: parsed.message || `Đây là những bộ phim mình tìm được cho bạn:`,
        movies: movies.slice(0, 10),
        cdnImage: searchResults[0]?.cdnImage || '',
      });
    }

    return Response.json({
      type: 'chat',
      message: parsed.message || 'Bạn muốn tìm phim gì? Hãy mô tả thể loại hoặc nội dung bạn muốn xem.',
      movies: [],
    });
  } catch (error: any) {
    console.error('AI Recommend Error:', error);
    return Response.json(
      { error: error.message || 'Có lỗi xảy ra với AI. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
