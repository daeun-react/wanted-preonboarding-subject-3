import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LOGGEDIN_USER } from "Utils/constants";
import { loadLocalStorage, loggedOutStorage } from "Utils/Storage";
import profile from "Assets/img/profile.png";

const LogoutButton = ({ setLoggedInUser }) => {
  const dropdownRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(false);
  const userData = loadLocalStorage(LOGGEDIN_USER);

  const getUserName = () => {
    if (userData) {
      const { name } = userData;
      return name;
    }
  };

  const onClick = () => setActiveMenu(!activeMenu);
  const handleLogout = () => {
    loggedOutStorage();
    setLoggedInUser(null);
  };

  useEffect(() => {
    const pageClickEvent = (e) => {
      !dropdownRef.current?.contains(e.target) && setActiveMenu(!activeMenu);
      if (activeMenu) {
        window.addEventListener("click", pageClickEvent);
      }

      return () => {
        window.removeEventListener("click", pageClickEvent);
      };
    };
  }, [activeMenu]);

  return (
    <Wrapper>
      <button onClick={onClick} type="button">
        <div className="profile-wrapper">
          <img src={profile} alt="내 계정 관리 열기 버튼" />
        </div>
        <ul ref={dropdownRef} className={`menu ${activeMenu ? "menu-active" : ""}`}>
          <li>
            <Link to="/">{getUserName()}</Link>
          </li>
          <li>
            <Link to="/">내 계정 관리</Link>
          </li>
          <li>
            <Link to="/logout" onClick={handleLogout}>
              로그아웃
            </Link>
          </li>
        </ul>
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  > button {
    position: relative;

    .profile-wrapper {
      width: 50px;
      height: 50px;
      border: 1px solid ${({ theme }) => theme.color.fontblack};
      border-radius: 50%;
      margin: 0 auto;
      padding-top: 1px;

      img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 1px solid ${({ theme }) => theme.color.borderline};
      }
    }

    .menu {
      padding: 0 10px;
      background-color: ${({ theme }) => theme.color.background};
      border-radius: 10px;
      position: absolute;
      top: 55px;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 120px;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s;

      li > a {
        display: block;
        padding: 10px;
      }

      li + li {
        border-top: 1px solid ${({ theme }) => theme.color.borderline};
      }
    }

    .menu-active {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export default LogoutButton;
