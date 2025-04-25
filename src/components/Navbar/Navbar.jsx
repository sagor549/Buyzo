import { NavLink, useNavigate } from "react-router-dom";
import logo from "/assets/logo.png";
import Theme from "../themeControler/Theme";
import SearchInput from "../search/SearchInput";
import { useAuth } from "../../context/data/MyState";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const categories = ['Electronics', 'Clothing', 'Home', 'Books'];
  
  // Ref for the drawer checkbox
  const drawerCheckbox = useRef(null);

  const handleSearch = (query) => {
    // Make sure query is properly encoded
    const encodedQuery = encodeURIComponent(query);
    navigate(`/products?search=${encodedQuery}`);
    
    // Close mobile menu after search
    if (drawerCheckbox.current && drawerCheckbox.current.checked) {
      drawerCheckbox.current.checked = false;
    }
  };

  // Close mobile menu when navigating
  const closeDrawer = () => {
    if (drawerCheckbox.current && drawerCheckbox.current.checked) {
      drawerCheckbox.current.checked = false;
    }
  };

  // Handler for logout to navigate after logout completes
  const handleLogout = async () => {
    try {
      await logout();
      closeDrawer(); // Close drawer after logout
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
    closeDrawer(); // Close drawer after category selection
  };

  return (
    <div className="drawer z-30">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" ref={drawerCheckbox} />
      <div className="drawer-content flex flex-col">
        <div className="navbar fixed top-0 z-30 shadow-lg bg-base-100 text-base-content">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          
          <div className="flex-1 px-2">
            <NavLink to="/" className="flex items-center" onClick={closeDrawer}>
              <img src={logo} alt="logo" className="h-9 md:h-12" />
            </NavLink>
          </div>
          
          <div className="hidden flex-none lg:flex lg:flex-1 lg:justify-end lg:items-center">
            <div className="form-control w-64 mr-6">
              <SearchInput onSearch={handleSearch} placeholder="Search products..." />
            </div>
            
            <div className="flex items-center gap-4">
              <Theme />
              
              {/* Category dropdown for desktop */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost">
                  Categories
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  {categories.map(category => (
                    <li key={category}>
                      <a onClick={() => handleCategoryClick(category)}>
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {currentUser ? (
                <>
                  <NavLink to="/cart" className="btn btn-ghost" onClick={closeDrawer}>Cart</NavLink>
                  <NavLink to="/profile" className="btn btn-ghost" onClick={closeDrawer}>Profile</NavLink>
                  {isAdmin && (
                    <NavLink to="/admin/dashboard" className="btn btn-ghost" onClick={closeDrawer}>Dashboard</NavLink>
                  )}
                  <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/signup" className="btn btn-ghost" onClick={closeDrawer}>Sign Up</NavLink>
                  <NavLink to="/login" className="btn btn-ghost" onClick={closeDrawer}>Login</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
          <div className="flex justify-center mb-6 mt-2">
            <img src={logo} alt="logo" className="h-12" />
          </div>
          
          {/* Mobile search - added search to mobile menu */}
          <div className="form-control mb-4">
            <SearchInput onSearch={handleSearch} placeholder="Search products..." />
          </div>
          
          <ul className="space-y-2">
            <li><NavLink to="/" className="btn btn-ghost justify-start" onClick={closeDrawer}>Home</NavLink></li>
            <li><NavLink to="/products" className="btn btn-ghost justify-start" onClick={closeDrawer}>All Products</NavLink></li>
            {currentUser ? (
              <>
                <li><NavLink to="/profile" className="btn btn-ghost justify-start" onClick={closeDrawer}>Profile</NavLink></li>
                <li><NavLink to="/cart" className="btn btn-ghost justify-start" onClick={closeDrawer}>Cart</NavLink></li>
                {isAdmin && <li><NavLink to="/admin/dashboard" className="btn btn-ghost justify-start" onClick={closeDrawer}>Dashboard</NavLink></li>}
                <li><button onClick={handleLogout} className="btn btn-ghost justify-start">Logout</button></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" className="btn btn-ghost justify-start" onClick={closeDrawer}>Login</NavLink></li>
                <li><NavLink to="/signup" className="btn btn-ghost justify-start" onClick={closeDrawer}>Sign Up</NavLink></li>
              </>
            )}
          </ul>

          <div className="divider"></div>
          
          <h3 className="text-lg font-bold mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category}>
                <button 
                  onClick={() => handleCategoryClick(category)} 
                  className="btn btn-ghost justify-start w-full text-left"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
