
export default function Header() {
  return (
    <div className="navbar shadow-sm px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a>Home</a></li>
            <li><a href="">Books</a></li>
            <li><a>blog</a></li>
          </ul>
        </div>
        <p className=" text-xl font-semibold text-blue-800 ">বইমিত্র</p>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Home</a></li>
          <li><a href="">Books</a></li>
          <li><a>blog</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-outline hover:bg-blue-800 border border-blue-800 rounded-4xl px-8">Login</a>
      </div>
    </div>
  )
}
