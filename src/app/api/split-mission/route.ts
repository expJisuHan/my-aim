import { NextResponse } from "next/server";
import { getMockSplitMissions } from "@/lib/mockData";

const SYSTEM_PROMPT = `너는 사용자의 미션을 더 작은 단계로 나누는 실행 코치다.
주어진 미션을 2~4개의 작은 하위 미션으로 나눠라.

규칙:
- 각 하위 미션은 3~10분 안에 완료할 수 있어야 한다.
- 구체적인 행동으로 시작하는 제목을 사용한다.
- 순서대로 진행할 수 있도록 배열한다.
- 반드시 JSON 형식으로만 응답한다.

출력 형식:
{
  "missions": [
    {
      "title": "",
      "description": "",
      "estimatedMinutes": 5,
      "completionCriteria": ""
    }
  ]
}`;

export async function POST(request: Request) {
  const body = await request.json();
  const { missionTitle, missionDescription } = body as {
    missionTitle: string;
    missionDescription: string;
  };

  if (!missionTitle) {
    return NextResponse.json({ error: "Invalid mission" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(getMockSplitMissions(missionTitle));
  }

  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userMessage = `미션 제목: ${missionTitle}\n미션 설명: ${missionDescription}`;

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

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    console.error("split-mission error:", err);
    return NextResponse.json(getMockSplitMissions(missionTitle));
  }
}
