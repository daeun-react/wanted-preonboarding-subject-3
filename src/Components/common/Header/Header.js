import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import LoginButton from "Components/common/Header/LoginButton";
import LogoutButton from "Components/common/Header/LogoutButton";
import { LOGGEDIN_USER } from "Utils/constants";
import { loadLocalStorage } from "Utils/Storage";
import logo from "Assets/img/logo.png";

const Header = () => {
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    if (!loggedInUser) setLoggedInUser(loadLocalStorage(LOGGEDIN_USER));
  }, [location]);

  useEffect(() => {
    console.log("loggedInUser :>> ", loggedInUser);
  }, [loggedInUser]);

  return (
    <Wrapper>
      <Link to="/">
        <img src={logo} alt="자란다 로고" />
      </Link>
      {loggedInUser ? <LogoutButton setLoggedInUser={setLoggedInUser} /> : <LoginButton />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${({ theme }) => theme.flexSet("space-between")}
  padding: 10px 100px;
  box-shadow: rgba(0, 0, 0, 0.08) 0 4px 2px -2px;
  background-color: ${({ theme }) => theme.color.background};
`;
export default Header;
