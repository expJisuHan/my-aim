import { NextResponse } from "next/server";
import { getMockFeedback } from "@/lib/mockData";

const SYSTEM_PROMPT = `너는 사용자의 하루 목표 진행 결과를 보고 짧고 따뜻한 피드백을 제공하는 AI 코치다.

규칙:
- 2~3문장으로 간결하게 작성한다.
- 긍정적이고 격려하는 톤을 유지한다.
- 오늘의 성과를 인정하고 내일을 위한 실용적인 팁을 하나 제안한다.
- 실패하더라도 감점 없음을 강조하며 다시 시작을 독려한다.
- 반드시 JSON 형식으로만 응답한다.

출력 형식:
{
  "feedback": "피드백 내용"
}`;

export async function POST(request: Request) {
  const body = await request.json();
  const { completedCount = 0, dailyTargetCount = 3, totalPoints = 0, streak = 0 } = body as {
    completedCount: number;
    dailyTargetCount: number;
    totalPoints: number;
    streak: number;
  };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      feedback: getMockFeedback(completedCount, dailyTargetCount, streak),
    });
  }

  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userMessage = `오늘 완료한 미션: ${completedCount}개\n하루 목표 미션 수: ${dailyTargetCount}개\n총 포인트: ${totalPoints}pt\n연속 진행: ${streak}일째`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response");

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    console.error("feedback error:", err);
    return NextResponse.json({
      feedback: getMockFeedback(completedCount, dailyTargetCount, streak),
    });
  }
}
