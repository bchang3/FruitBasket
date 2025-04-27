import { useRouter } from "next/router";

export default function LobbyNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full font-fuzzy_bubbles gap-4 mt-12 md:mt-24 h-full align-top justify-center text-primary-green">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Could not find lobby...
      </h1>
      <div className="text-2xl mt-2 text-center">
        {" "}
        Please check your code and try again!
      </div>
      <button
        onClick={() => router.push("/multiplayer")}
        className="flex flex-row mt-8 gap-2 cursor-pointer items-center select-none text-primary-chestnut"
      >
        <svg
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="#DC9666"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.52148 8.33398L8.18815 13.0007L7.00065 14.1673L0.333984 7.50065L7.00065 0.833984L8.18815 2.00065L3.52148 6.66732H13.6673V8.33398H3.52148Z"
            fill="#DC9666"
          />
        </svg>

        <div className="text-secondary-dark_gray font-semibold text-base w-fit">
          Back
        </div>
      </button>
    </div>
  );
}
