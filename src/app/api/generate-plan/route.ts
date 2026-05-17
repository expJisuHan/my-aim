import { NextResponse } from "next/server";
import { getMockPlan } from "@/lib/mockData";

const SYSTEM_PROMPT = `너는 사용자의 목표를 실행 가능한 미션으로 나누는 목표 코치다.
사용자가 입력한 목표를 분석해서 2~4개의 챕터와 6~12개의 짧은 미션으로 나눠라.

규칙:
- 첫 미션은 5분 안에 할 수 있을 만큼 작아야 한다.
- 각 미션은 5~20분 내외로 수행 가능해야 한다.
- 미션은 구체적인 행동으로 시작해야 한다.
- "공부하기", "준비하기"처럼 모호하게 쓰지 말고 실제 행동으로 작성한다.
- 각 미션에는 description, estimatedMinutes, completionCriteria를 포함한다.
- 실패 부담을 줄이기 위해 쉬운 단계부터 배열한다.
- 반드시 JSON 형식으로만 응답한다.

출력 형식:
{
  "goalTitle": "",
  "chapters": [
    {
      "title": "",
      "missions": [
        {
          "title": "",
          "description": "",
          "estimatedMinutes": 5,
          "completionCriteria": ""
        }
      ]
    }
  ]
}`;

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, dailyTargetCount = 3, difficulty = "normal" } = body as {
    goal: string;
    dailyTargetCount?: number;
    difficulty?: string;
  };

  if (!goal || typeof goal !== "string" || goal.trim().length < 3) {
    return NextResponse.json({ error: "Invalid goal" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(getMockPlan(goal));
  }

  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userMessage = `목표: ${goal}\n하루 목표 미션 수: ${dailyTargetCount}\n난이도: ${difficulty}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response");

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-plan error:", err);
    // Fallback to mock on any error
    return NextResponse.json(getMockPlan(goal));
  }
}
