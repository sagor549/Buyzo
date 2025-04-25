import { NavLink } from "react-router-dom";
import logo from "/assets/logo.png";
import Theme from "../themeControler/Theme";
import SearchInput from "../search/SearchInput";
import { useAuth } from "../../context/data/myState";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="drawer z-30">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar fixed top-0 z-30 shadow-lg bg-base-100 text-base-content">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          
          <div className="flex-1 px-2">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="logo" className="h-9 md:h-12" />
            </NavLink>
          </div>
          
          {/* Mobile view login button */}
          {!currentUser && (
            <div className="flex-none lg:hidden">
              <NavLink to="/login" className="btn btn-ghost">
                Login
              </NavLink>
            </div>
          )}
          
          {/* Desktop view */}
          <div className="hidden flex-none lg:flex lg:flex-1 lg:justify-end lg:items-center">
            <div className="form-control w-64 mr-6">
              <SearchInput />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="mr-2 flex items-center">
                <Theme />
              </div>

              {currentUser ? (
                <>
                  {isAdmin && (
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "btn btn-secondary text-secondary-content font-bold px-5"
                          : "btn btn-ghost px-5"
                      }
                    >
                      Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/order"
                    className={({ isActive }) =>
                      isActive
                        ? "btn btn-primary text-primary-content font-bold px-5"
                        : "btn btn-ghost px-5"
                    }
                  >
                    Orders
                  </NavLink>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-ghost px-5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive
                        ? "btn btn-primary text-primary-content font-bold px-5"
                        : "btn btn-ghost px-5"
                    }
                  >
                    Sign Up
                  </NavLink>

                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "btn btn-primary text-primary-content font-bold px-5"
                        : "btn btn-ghost px-5"
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive
                        ? "btn btn-secondary text-secondary-content font-bold px-5"
                        : "btn btn-ghost px-5"
                    }
                  >
                    Admin
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 h-full bg-base-100 text-base-content flex flex-col">
          <div className="flex justify-center mb-6 mt-2">
            <img src={logo} alt="logo" className="h-12" />
          </div>
          
          <ul className="space-y-4 text-lg">
            {currentUser ? (
              <>
                {isAdmin && (
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "font-bold bg-secondary text-secondary-content rounded-lg"
                          : "hover:bg-base-200 rounded-lg"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/order"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold bg-primary text-primary-content rounded-lg"
                        : "hover:bg-base-200 rounded-lg"
                    }
                  >
                    Orders
                  </NavLink>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:bg-base-200 rounded-lg w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold bg-primary text-primary-content rounded-lg"
                        : "hover:bg-base-200 rounded-lg"
                    }
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold bg-primary text-primary-content rounded-lg"
                        : "hover:bg-base-200 rounded-lg"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold bg-secondary text-secondary-content rounded-lg"
                        : "hover:bg-base-200 rounded-lg"
                    }
                  >
                    Admin Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          
          <div className="divider">Categories</div>
          
          <ul className="space-y-3 text-lg">
            <li><a className="hover:bg-base-200 rounded-lg">Category 1</a></li>
            <li><a className="hover:bg-base-200 rounded-lg">Category 2</a></li>
            <li><a className="hover:bg-base-200 rounded-lg">Category 3</a></li>
          </ul>
          
          <div className="mt-auto mb-4 flex justify-center">
            <Theme />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;