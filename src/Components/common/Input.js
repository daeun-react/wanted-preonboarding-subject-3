import React, { forwardRef } from "react";
import styled, { css } from "styled-components";
import MessageBox from "Components/common/MessageBox";

const Input = (
  {
    type = "text",
    name,
    value,
    onChange = () => {},
    placeholder,
    icon = null,
    error = false,
    errorMessage = null,
    successMessage = null,
    width = "100%",
    isVisible = true,
    numberOnly = false,
    maxLength = null,
  },
  ref
) => {
  return (
    <Wrapper width={width} isVisible={isVisible}>
      <InputWrapper error={error} numberOnly={numberOnly}>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {icon}
      </InputWrapper>
      {error && errorMessage && <MessageBox>{errorMessage}</MessageBox>}
      {!error && successMessage && <MessageBox textColor="#87BF44">{successMessage}</MessageBox>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: ${({ width }) => width || "100%"};
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  padding: 10px 0;
`;

const InputWrapper = styled.div`
  position: relative;

  input {
    width: 100%;
    height: 40px;
    padding-left: 8px;
    border: 1px solid ${({ theme }) => theme.color.borderline};
    border-radius: 4px;
    font-size: 16px;
    text-align: ${({ numberOnly }) => (numberOnly ? "center" : "left")};

    &::placeholder {
      color: ${({ theme }) => theme.color.fontGray};
    }
    &:focus {
      border-color: ${({ theme }) => theme.color.green};
    }

    ${({ error }) =>
      error &&
      css`
        background-color: ${({ theme }) => theme.color.lightred};
        border-color: ${({ theme }) => theme.color.red};
        &:focus {
          border-color: ${({ theme }) => theme.color.red};
        }
      `}
  }

  img {
    position: absolute;
    right: 16px;
    width: 18px;
    height: 40px;
  }
`;

export default forwardRef(Input);
