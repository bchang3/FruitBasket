import { FormEvent, useEffect, useState } from "react";
import Button from "../Button";
import Checkbox from "../Checkbox";
import { toastError } from "@/utils/utils";
import { SinglePlayerSettings } from "@/lib/hooks/useSinglePlayerGame";

interface SinglePlayerSetupProps {
  loading: boolean;
  onStart: (settings: SinglePlayerSettings) => void;
}

export default function SinglePlayerSetup({
  loading,
  onStart,
}: SinglePlayerSetupProps) {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [numRounds, setNumRounds] = useState<number>(10);
  const [guessTime, setGuessTime] = useState<number>(15);

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("/api/getCategories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setCategoryOptions(await res.json());
      }
    };
    getCategories();
  }, []);

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (categories.length === 0) {
      toastError("Pick at least one category!");
      return;
    }
    onStart({ categories, numRounds, guessTime });
  };

  return (
    <div className="flex flex-col items-center w-full font-poppins gap-4 mt-16 md:mt-24 h-full text-primary-green">
      <h1 className="text-5xl font-bold mb-4">Single Player</h1>
      <form
        className="flex flex-col items-center gap-8 w-full md:w-2/3"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full gap-2">
          <h2 className="font-semibold text-2xl">Categories:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
            {categoryOptions.map((category) => (
              <Checkbox
                key={category}
                label={category}
                checked={categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-12 text-xl">
          <label className="flex flex-col gap-2">
            Rounds
            <input
              type="number"
              min={1}
              max={25}
              value={numRounds}
              onChange={(e) => setNumRounds(Number(e.target.value))}
              className="border-2 border-black rounded-md h-12 p-2 w-32"
            />
          </label>
          <label className="flex flex-col gap-2">
            Guess time (s)
            <input
              type="number"
              min={10}
              max={120}
              value={guessTime}
              onChange={(e) => setGuessTime(Number(e.target.value))}
              className="border-2 border-black rounded-md h-12 p-2 w-32"
            />
          </label>
        </div>
        <Button
          type="submit"
          content={loading ? "Loading..." : "Start Game"}
          disabled={loading}
          className="rounded-full px-6 text-xl"
        />
      </form>
    </div>
  );
}
