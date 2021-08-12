import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Input from "Components/common/Input";
import Button from "Components/common/Button";
import MessageBox from "Components/common/MessageBox";
import { USER_STORAGE, LOGGEDIN_USER } from "Utils/constants";
import { loadLocalStorage, saveLocalStorage } from "Utils/Storage";
import { compareSync } from "Utils/bcrypt";
import { isEmail } from "Utils/validator";
import { mail, closedEye, openedEye } from "Assets/svg";

const Login = () => {
  const history = useHistory();
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [unknownUser, setUnknownUser] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    pw: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    pw: false,
  });

  const loginValidator = {
    email: (email) => isEmail(email),
    pw: (pw) => pw.length,
  };

  const isAllValid = (form) => {
    for (const name in form) {
      const value = form[name];
      const loginValidateFunction = loginValidator[name];
      if (!loginValidateFunction(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: true,
        }));
        return false;
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: false,
        }));
      }
    }
    return true;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (isAllValid(formData)) {
      const userData = loadLocalStorage(USER_STORAGE);
      if (!userData) return setUnknownUser(true);
      const existedUser = userData.find(
        (user) => user.email === formData.email && compareSync(formData.pw, user.pw)
      );
      if (!existedUser) return setUnknownUser(true);

      saveLocalStorage(LOGGEDIN_USER, existedUser);
      setUnknownUser(false);
      history.push("/");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleLoginSubmit}>
        <h4>로그인</h4>

        <Input
          name="email"
          value={formData.email}
          onChange={handleLoginChange}
          placeholder="이메일을 입력하세요"
          icon={<img src={mail} alt="email" />}
          error={errors.email}
          errorMessage="이메일을 다시 확인해 주세요."
        />

        <Input
          name="pw"
          value={formData.pw}
          onChange={handleLoginChange}
          placeholder="비밀번호를 입력하세요"
          type={visiblePassword ? "password" : "text"}
          icon={
            visiblePassword ? (
              <img src={closedEye} alt="pw" onClick={() => setVisiblePassword(!visiblePassword)} />
            ) : (
              <img src={openedEye} alt="pw" onClick={() => setVisiblePassword(!visiblePassword)} />
            )
          }
          error={errors.pw}
          errorMessage="비밀번호를 다시 입력해 주세요"
        />

        {unknownUser && <MessageBox>로그인 또는 패스워드를 다시 확인해주세요</MessageBox>}

        <Button type="submit" value="로그인" marginTop="10px" />
      </Form>

      <NavLink to="/signup">
        자란다 계정이 없으신가요? <span>회원가입</span>
      </NavLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${({ theme }) => theme.flexSet("center", "center", "column")}
  width: 100%;
  height: calc(100% - 72px);
  background-color: ${({ theme }) => theme.color.fontWhite};
`;

const Form = styled.form`
  ${({ theme }) => theme.flexSet("space-between", "center", "column")}
  width: 450px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.color.borderline};

  h4 {
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 0;
  }
`;

const NavLink = styled(Link)`
  margin-top: 20px;
  color: ${({ theme }) => theme.color.fontGray};

  span {
    margin-left: 10px;
    color: ${({ theme }) => theme.color.green};
    font-weight: 600;
    text-decoration: underline;
  }
`;

export default Login;
