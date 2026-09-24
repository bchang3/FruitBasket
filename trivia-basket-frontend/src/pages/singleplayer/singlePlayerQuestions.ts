import env from "@beam-australia/react-env";

const API_URL = env("NEXT_PUBLIC_API_URL");

export interface SinglePlayerOption {
  questionOptionID: number;
  questionOptionLabel: string;
  questionOptionText: string;
}

export interface SinglePlayerQuestion {
  questionID: string;
  questionText: string;
  questionCategory: string;
  questionOptions: SinglePlayerOption[];
  questionAnswer: number;
}

/**
 * Fetches `count` random questions (with options) from the backend API.
 */
export async function fetchSinglePlayerQuestions(
  count: number,
  categories?: string[],
): Promise<SinglePlayerQuestion[]> {
  const params = new URLSearchParams({ count: String(count) });
  if (categories && categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  const response = await fetch(
    `${API_URL}/api/questions/random?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch single player questions");
  }

  return response.json();
}

/**
 * Returns a copy of a question's options in randomized order.
 */
export function shuffleOptions(
  options: SinglePlayerOption[],
): SinglePlayerOption[] {
  return [...options].sort(() => Math.random() - 0.5);
}
