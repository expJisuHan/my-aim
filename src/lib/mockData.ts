import type { GeneratePlanResponse } from "./types";

export function getMockPlan(goal: string): GeneratePlanResponse {
  return {
    goalTitle: goal,
    chapters: [
      {
        title: "시작하기",
        missions: [
          {
            title: "목표를 한 문장으로 정리하기",
            description:
              "지금 해야 할 일이 무엇인지 누가, 어떤 문제를, 어떻게 해결하는지 한 문장으로 명확하게 적어보세요.",
            estimatedMinutes: 5,
            completionCriteria: "명확한 한 문장이 완성되면 완료",
          },
          {
            title: "가장 쉬운 첫 행동 찾기",
            description:
              "지금 당장 할 수 있는 가장 작고 쉬운 행동 하나를 구체적으로 적어보세요. 완벽하지 않아도 됩니다.",
            estimatedMinutes: 3,
            completionCriteria: "구체적인 첫 행동 1개 이상 적기",
          },
          {
            title: "5분만 집중해서 시작하기",
            description:
              "완벽할 필요 없습니다. 타이머를 켜고 5분만 집중해서 무언가 시작해보세요. 시작이 반입니다.",
            estimatedMinutes: 5,
            completionCriteria: "5분 이상 실제 작업을 시작하면 완료",
          },
        ],
      },
      {
        title: "본격 진행",
        missions: [
          {
            title: "핵심 내용 3가지 정리하기",
            description:
              "이 작업에서 꼭 포함해야 할 핵심 내용 3가지를 간결하게 적어보세요.",
            estimatedMinutes: 10,
            completionCriteria: "핵심 내용 3개 이상 작성",
          },
          {
            title: "첫 번째 초안 만들기",
            description:
              "완벽하지 않아도 됩니다. 핵심 내용을 바탕으로 우선 초안을 만들어보세요.",
            estimatedMinutes: 15,
            completionCriteria: "초안 1개 이상 완성",
          },
          {
            title: "검토하고 완성하기",
            description:
              "작성한 내용을 처음부터 한 번 읽고 간단히 수정하여 마무리해보세요.",
            estimatedMinutes: 10,
            completionCriteria: "최종 검토 및 수정 완료",
          },
        ],
      },
    ],
  };
}

export function getMockSplitMissions(missionTitle: string) {
  return {
    missions: [
      {
        title: `${missionTitle} — 준비하기`,
        description: "필요한 것들을 먼저 확인하고 준비해보세요.",
        estimatedMinutes: 5,
        completionCriteria: "준비 완료",
      },
      {
        title: `${missionTitle} — 핵심만 먼저 하기`,
        description: "가장 중요한 부분 하나만 집중해서 처리해보세요.",
        estimatedMinutes: 7,
        completionCriteria: "핵심 부분 완료",
      },
      {
        title: `${missionTitle} — 마무리하기`,
        description: "나머지를 마무리하고 확인해보세요.",
        estimatedMinutes: 5,
        completionCriteria: "전체 완료",
      },
    ],
  };
}

export function getMockFeedback(
  completedCount: number,
  dailyTargetCount: number,
  streak: number
): string {
  if (completedCount >= dailyTargetCount) {
    const feedbacks = [
      `오늘 목표 ${dailyTargetCount}개를 모두 완료했어요! 시작 장벽을 넘긴 게 가장 큰 성과예요. 내일도 첫 미션을 작게 잡아서 시작해보세요.`,
      `${completedCount}개 미션 완료, 정말 잘 해냈어요! 작은 실행이 쌓여서 큰 변화가 됩니다. ${streak > 1 ? `${streak}일 연속 진행 중이에요!` : "내일도 이어가보세요!"}`,
      `오늘 목표를 달성했어요. 특히 포기하지 않고 끝까지 이어간 점이 훌륭해요. 내일은 오늘보다 더 편하게 시작할 수 있을 거예요.`,
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }

  return `오늘 ${completedCount}개 미션을 완료했어요. 목표에 조금 못 미쳤지만 괜찮아요. 완료한 것만으로도 충분히 잘했습니다. 내일 다시 시작하면 복귀 보너스 포인트도 받을 수 있어요!`;
}
