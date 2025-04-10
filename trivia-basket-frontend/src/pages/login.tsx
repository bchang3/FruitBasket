export default function Login() {
  return (
    <div className="flex flex-col justify-center text-center items-center gap-24 w-full h-full bg-primary-green">
      <div className="flex flex-col gap-4 items-center justify-center -mt-24">
        <img src="/trivia-basket-icon.png" className="w-48 h-auto" />
        <h1 className="text-white text-6xl font-semibold">
          Welcome to Trivia Basket!
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-white text-left font-semibold text-lg">
            Username:
          </p>
          <input className="bg-primary-beige p-2 focus:border-primary-chestnut border-gray-600 focus:outline-none focus:ring-0 border-2 rounded-md h-12 text-lg w-[600px]"></input>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white text-left font-semibold text-lg">
            Password:
          </p>
          <input className="bg-primary-beige p-2 focus:border-primary-chestnut border-gray-600 focus:outline-none focus:ring-0 border-2 rounded-md h-12 text-lg w-[600px]"></input>
        </div>
        <div className="w-full flex flex-row items-end justify-end cursor-pointer">
          <svg
            className="hover:scale-105"
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="36px"
            fill="white"
          >
            <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
