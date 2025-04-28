import Button from "@/lib/components/Button";
import Checkbox from "@/lib/components/Checkbox";
import { cn, Flashcard } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function Flashcards() {
  const [username, setUsername] = useState<string>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  console.log(flashcards);
  const getFlashcards = async (username: string) => {
    const res = await fetch(`/api/getUserFlashcards/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const flash = await res.json();
      console.log(flash);
      setFlashcards(flash);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        getFlashcards(data.username);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col items-center gap-12 text-center w-full h-full text-6xl text-primary-green font-semibold">
      <input
        className="mt-12 w-1/2 bg-white rounded-full h-12 text-base p-4 text-black font-normal border border-gray-400"
        placeholder="Search.."
      />
      <Button
        content="Start Practice"
        className="rounded-full absolute top-[140px] right-12 px-4 font-bold"
      />
      <div className="w-full min-w-[1120px] rounded-[14px] shadow-lg border-primary-chestnut border-2">
        <table className="w-full font-poppins table-fixed">
          {/* Table Header */}
          <thead className="h-[61px] p-4 bg-primary-light_beige text-xl text-primary-green font-bold justify-items-stretch select-none">
            <tr>
              <th className="rounded-l-[14px] px-4 w-[5%] border-primary-chestnut border-r-[1.5px]"></th>
              <th className="rounded-tl-[14px] px-4 w-[30%] border-primary-chestnut border-r-[1.5px] text-center">
                Question
              </th>
              <th className="rounded-tl-[14px] px-4 w-[20%] border-primary-chestnut border-r-[1.5px] text-center">
                Category
              </th>
              <th className="rounded-r-[14px] px-4 w-[45%] border-primary-chestnut text-center">
                Answer
              </th>
            </tr>
          </thead>

          <tbody>
            {flashcards.length > 0 &&
              flashcards.map((flashcard, i) => {
                return (
                  <tr
                    key={flashcard.questionID}
                    className={cn(
                      "text-primary-chestnut bg-primary-light_beige border-t-[1.5px] border-primary-chestnut",
                    )}
                  >
                    <td
                      className={cn(
                        "text-base border-primary-chestnut border-r-[1.5px]",
                        i === flashcards.length - 1 && "rounded-bl-[14px]",
                      )}
                    >
                      <div className="flex flex-row justify-center w-full ml-3">
                        <Checkbox />
                      </div>
                    </td>
                    <td className="px-4 text-base border-primary-chestnut border-r-[1.5px]">
                      {flashcard.questionText}
                    </td>
                    <td className="px-4 text-base border-primary-chestnut border-r-[1.5px]">
                      {flashcard.categoryName}
                    </td>
                    <td
                      className={cn(
                        "px-4 text-base",
                        i === flashcards.length - 1 && "rounded-br-[14px]",
                      )}
                    >
                      {flashcard.answerText}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
