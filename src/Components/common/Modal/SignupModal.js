import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const SignupModal = () => {
  const history = useHistory();
  useEffect(() => {
    setTimeout(() => {
      history.replace("/login");
    }, 2000);
  });

  return (
    <Wrapper>
      <span>가입이 완료되었습니다🎉</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${({ theme }) => theme.flexSet("center", "center", "column")}
  width: 500px;
  height: 300px;
  background-color: ${({ theme }) => theme.color.fontWhite};
  border: 1px solid ${({ theme }) => theme.color.green};

  > span {
    font-weight: 700;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default SignupModal;
