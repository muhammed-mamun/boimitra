const categories = [
  "Fiction",
  "Poetry",
  "History",
  "Biography",
  "Philosophy",
  "Religion",
  "Science",
  "Self-Help",
  "Travel",
  "Classic",
  "Mystery",
  "Romance"
]
export default function Categories() {
  return (
    <div className="flex justify-center items-center flex-wrap gap-3 py-10 px-4 bg-black border-y border-slate-900">
      {categories.map((category) => (
        <button key={category} className="px-5 py-2 bg-slate-950 hover:bg-blue-600 rounded-full border border-slate-800 text-slate-400 text-sm hover:text-white hover:border-blue-500 transition-all duration-300">
          {category}
        </button>
      ))}
    </div>
  )
}
