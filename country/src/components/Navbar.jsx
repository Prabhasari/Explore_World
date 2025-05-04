import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 p-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold">🌍 My Country Explorer</div>
      <div className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/favorites" className="hover:underline">My Favourites</Link>
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="text-sm px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">SignIn</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
