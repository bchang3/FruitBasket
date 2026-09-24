export interface QuestionOption {
  questionOptionID: number;
  questionOptionLabel: string;
  questionOptionText: string;
}

export interface Question {
  questionID: string;
  questionText: string;
  questionCategory: string;
  questionOptions: QuestionOption[];
  questionAnswer: number;
}

interface SinglePlayerGameResponse {
  gameID: number;
  questions: Question[];
}

/**
 * Starts a solo game (same Game/GameQuestions rows multiplayer uses) and returns
 * its questions with options attached.
 */
export async function fetchQuestions(
  username: string,
  count: number,
  categories?: string[],
): Promise<SinglePlayerGameResponse> {
  const response = await fetch(`/api/singlePlayerGame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, numQuestions: count, categories }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch single player questions");
  }

  return response.json();
}

/**
 * Returns a copy of a question's options in randomized order.
 */
export function shuffleOptions(
  options: QuestionOption[],
): QuestionOption[] {
  return [...options].sort(() => Math.random() - 0.5);
}
