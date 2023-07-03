import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../context/authContext";

import "./Navbar.css";

export default function Navbar() {
  const [allMenus, setAllMenus] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:4000/v1/menus`)
      .then((res) => res.json())
      .then((menus) => {
        setAllMenus(menus);
      });
  }, []);

  return (
    <div className="main-header">
      <div className="container-fluid">
        <div className="main-header__content">
          <div className="main-header__right">
          <NavLink to ='/'>
            <img
           
              src="/images/logo/neo.png"
              className="main-header__logo"
              alt="نعولرن"
            />
            </NavLink>

            <ul className="main-header__menu">
              <li className="main-header__item">
                <NavLink to='/' className="main-header__link">
                  صفحه اصلی
                </NavLink>
              </li>

              {allMenus.map((menu, index) => (
                <li className="main-header__item" key={index}>
                  <Link to={`/category-info/${menu.href}/1`} className="main-header__link">
                    {menu.title}
                    {menu.submenus.length !== 0 && (
                      <>
                        <i className="fas fa-angle-down main-header__link-icon"></i>
                        <ul className="main-header__dropdown">
                          {menu.submenus.map((submenu) => (
                            <li className="main-header__dropdown-item">
                              <Link
                                to={submenu.href}
                                className="main-header__dropdown-link"
                              >
                                {submenu.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </Link>
                </li>
              ))}

              {/* <li className="main-header__item">
                <a href="#" className="main-header__link">
                  فرانت اند
                  
                </a>
              </li> */}
            </ul>
          </div>

          <div className="main-header__left">
          

            {authContext.isLoggedIn ? (
              <Link to="/my-account" className="main-header__profile">
                <span className="main-header__profile-text">
                  {authContext.userInfos.name}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="main-header__profile">
                <span className="main-header__profile-text">
                  ورود / ثبت نام
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
