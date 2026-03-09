export const MBTI_SCORES: Record<string, Record<string, number>> = {
  ENTJ: {
    ISFP: 100,
    INFP: 100,
    ESFP: 100,
    ESTP: 75,
    ISTP: 75,
    INTP: 75,
    ENFP: 75,
  },
  ENTP: {
    ISFJ: 100,
    ISTJ: 100,
    ENTP: 100,
    ESTJ: 75,
    ESFJ: 75,
    INFJ: 75,
    INTJ: 75,
  },
  INTJ: {
    ESFP: 100,
    ESTP: 100,
    ISFP: 100,
    INFP: 75,
    INFJ: 75,
    ENFP: 75,
    ENTP: 75,
  },
  INTP: {
    ESFJ: 100,
    ENFJ: 100,
    ISFJ: 100,
    INFJ: 75,
    ESTJ: 75,
    ISTJ: 75,
    ENTJ: 75,
  },
  ESTJ: {
    INFP: 100,
    ISFP: 100,
    INTP: 100,
    ENTP: 75,
    ISTP: 75,
    ESFP: 75,
    ENFP: 75,
  },
  ESFJ: {
    INTP: 100,
    ISTP: 100,
    ENTP: 100,
    ENFP: 75,
    INFP: 75,
    ISTJ: 75,
    ESFJ: 75,
  },
  ISTJ: {
    ENFP: 100,
    ENTP: 100,
    ISFP: 100,
    INFP: 75,
    ESTP: 75,
    ESFP: 75,
    INTP: 75,
  },
  ISFJ: {
    ENTP: 100,
    ENFP: 100,
    INTP: 100,
    ISTP: 75,
    ESFP: 75,
    ESTP: 75,
    ESTJ: 75,
  },
  ENFJ: {
    ISTP: 100,
    INTP: 100,
    ESTP: 100,
    ESFP: 75,
    ENFJ: 75,
    INFP: 75,
    ISFP: 75,
  },
  ENFP: { ISTJ: 100, ISFJ: 100, ENTJ: 100, INFP: 75, INFJ: 75, INTJ: 75 },
  INFJ: {
    ESTP: 100,
    ISTP: 100,
    ENTP: 100,
    ENFJ: 75,
    INTP: 75,
    ENTJ: 75,
    INFJ: 75,
  },
  INFP: {
    ESTJ: 100,
    ENTJ: 100,
    INTJ: 100,
    ISTJ: 75,
    ENFJ: 75,
    ESFJ: 75,
    ENTP: 75,
  },
  ESTP: {
    INFJ: 100,
    INTJ: 100,
    ENFJ: 100,
    ENTJ: 75,
    ISFJ: 75,
    ISTP: 75,
    ISTJ: 75,
  },
  ESFP: {
    INTJ: 100,
    INFJ: 100,
    ENTJ: 100,
    ENFJ: 75,
    ESTJ: 75,
    ISTJ: 75,
    ISFJ: 75,
  },
  ISTP: { ENFJ: 100, INFJ: 100, ENFP: 100, ESFJ: 75, ISFJ: 75, ESFP: 75 },
  ISFP: {
    ENTJ: 100,
    ESTJ: 100,
    INTJ: 100,
    ISTJ: 75,
    ESFP: 75,
    ISFP: 75,
    INFJ: 75,
  },
};

export const calculateSynergy = (
  myMbti: string,
  targetMbti: string,
): number => {
  return MBTI_SCORES[myMbti]?.[targetMbti] ?? 25;
};

export const getTop5Matches = (
  myMbti: string,
  allUserMbtis: { userId: string; mbti: string }[],
) => {
  return allUserMbtis
    .map((user) => ({
      userId: user.userId,
      score: MBTI_SCORES[myMbti]?.[user.mbti] ?? 25,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
