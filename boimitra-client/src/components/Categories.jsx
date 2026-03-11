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
    <div className="flex justify-center items-center flex-wrap gap-2">
      {categories.map((category) => (
        <button key={category} className="px-4 py-2 hover:bg-blue-600 rounded-full border border-gray-300 text-sm hover:text-white transition">
          {category}
        </button>
      ))}
    </div>
  )
}
