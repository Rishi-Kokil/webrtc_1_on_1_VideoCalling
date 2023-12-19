import { Link } from "react-router-dom";
import { logo, menu, close } from "../assests";
import { navlinks } from "../Constants/constants";
import { useState } from "react";

const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    return (
        <nav
            className="max-w-7xl mx-auto h-[20vh] flex items-center justify-between p-3"
        >
            <Link to="/"
                className="flex items-center gap-1"
            >
                <img
                    src={logo}
                    alt="Company Logo"
                    className="w-[120px]" />
                <h2
                    className="font-semibold sm:block hidden "
                >WebRTC VideoCalling</h2>
            </Link>

            <ul
                className="sm:flex hidden w-full justify-end  items-center"
            >
                {navlinks.map((items) => (
                    <li
                        key={items.title}
                        className="m-1 p-1 acti"
                    >
                        <Link
                            to={items.url}
                        >
                            {items.title}
                        </Link>
                    </li>
                ))}
            </ul>

            <img
                src={
                    !toggle ? menu : close
                }
                alt="menuIcon"
                onClick={() => { setToggle(!toggle) }}
                className="h-[30px] sm:hidden block relative"
            />
            
                <ul
                    className={`${toggle ? "block" : "hidden"} p-1 bg-black text-white rounded-xl right-2 top-[100px]  absolute w-[30%] flex flex-col gap-1`}
                >
                    {navlinks.map((items) => (
                        <li
                            key={items.title}
                            className="m-1 px-2"
                        >
                            <Link
                                to={items.url}
                            >
                                {items.title}
                            </Link>
                        </li>
                    ))}

                </ul>


        </nav>
    );
}

export default Navbar;