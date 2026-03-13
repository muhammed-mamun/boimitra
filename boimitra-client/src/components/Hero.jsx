import { FaArrowRight } from "react-icons/fa6";

export default function Hero() {
  return (
    <div className="my-20 flex flex-col items-center mx-auto text-center px-4">
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold text-blue-600">Read Books, Build Community</h1>
      <p className="mb-5 text-blue-200">
”Books and doors are the same thing. You open them, and you go through into another world.” - Jeanette Winterson      </p>
    </div>
  </div>
    <a href="" className="btn btn-outline hover:bg-blue-600 rounded-4xl w-48">Read Books<FaArrowRight />
</a>
</div>
  )
}
