import { useState, useEffect } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 py-10 px-4 bg-black border-y border-slate-900 min-h-[120px]">
      {loading ? (
        <span className="loading loading-spinner text-blue-500"></span>
      ) : categories.length === 0 ? (
        <p className="text-slate-500 text-sm">No categories found.</p>
      ) : (
        categories.map((category) => (
          <button key={category} className="px-5 py-2 bg-slate-950 hover:bg-blue-600 rounded-full border border-slate-800 text-slate-400 text-sm hover:text-white hover:border-blue-500 transition-all duration-300">
            {category}
          </button>
        ))
      )}
    </div>
  )
}
