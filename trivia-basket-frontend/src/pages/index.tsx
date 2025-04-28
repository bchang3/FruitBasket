import LinkButton from "@/lib/components/LinkButton";

export default function Home() {
  return (
    <div className="flex justify-center text-center items-center w-full h-full text-6xl text-primary-green font-semibold">
      <div className="flex flex-col items-center w-1/3 gap-6 mt-24">
        <img
          src="/fruit-icons/strawberry.png"
          className="h-64"
          alt="strawberry icon"
        />
        <LinkButton
          content="Single Player"
          className="w-60 text-2xl"
          link="/"
        />
      </div>
      <div className="flex flex-col items-center gap-12">
        Welcome to Trivia Basket!
        <img src="/trivia-basket-icon.png" className="w-96" alt="basket icon" />
      </div>

      <div className="flex flex-col items-center w-1/3 gap-6 mt-24">
        <img
          src="/multiplayer_icon.png"
          className="h-64"
          alt="strawberry icon"
        />
        <LinkButton
          content="Multiplayer"
          className="w-60 text-2xl"
          link="/multiplayer"
        />
      </div>
    </div>
  );
}
