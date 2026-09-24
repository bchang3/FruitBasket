import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col justify-center w-full md:w-1/2 h-full self-center font-poppins text-center gap-12 bg-primary-beige text-primary-green">
      <div className="text-5xl font-medium">
        Sorry! The page you are looking for does not exist.
      </div>
      <Link href="/" className="underline text-primary-blue text-3xl">
        Go to homepage.
      </Link>
    </div>
  );
}
