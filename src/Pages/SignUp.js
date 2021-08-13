import React, { useState } from "react";
import styled, { css } from "styled-components";

import * as regexFunc from "Utils/validator.js";
import { hashSync } from "Utils/bcrypt";
import { AUTH_LEVEL, USER_STORAGE } from "Utils/constants";
import { loadLocalStorage, saveLocalStorage, autoIncrementUserId } from "Utils/Storage";
import {
  SIGNUP_ALL_ELEMENTS,
  SIGNUP_INPUT_ELEMENTS,
  SIGNUP_EMAIL_ERROR_TYPE,
  SIGNUP_PASSWORD_POLICY,
} from "Utils/signup/constants";

import { Button, Input, Radio } from "Components/common";
import { Modal, AddressModal, CreditModal, SignupModal } from "Components/common/Modal";
import { checkIcon } from "Assets/svg";

const SignUp = () => {
  const defaultFormData = SIGNUP_ALL_ELEMENTS.reduce(
    (acc, cur) => (acc = { ...acc, [cur.name]: cur.default }),
    {}
  );
  const defaultErrors = SIGNUP_ALL_ELEMENTS.reduce(
    (acc, cur) => (acc = { ...acc, [cur.name]: false }),
    {}
  );
  const defaultPassworError = SIGNUP_PASSWORD_POLICY.reduce(
    (acc, cur) => (acc = { ...acc, [cur.name]: false }),
    {}
  );
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [passwordError, setPasswordError] = useState(defaultPassworError);
  const [emailErrorStatus, setEmailErrorStatus] = useState(SIGNUP_EMAIL_ERROR_TYPE.default);
  const [isEmailDuplicateChecked, setEmailDuplicateChecked] = useState(false);
  const [isVisiblePassword, setVisiblePassword] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const getInpuType = (name) => {
    if (name.includes("pw")) {
      return isVisiblePassword ? "text" : "password";
    }
    return "text";
  };

  const getInputIcon = (name) => {
    if (name.includes("pw")) {
      const src = isVisiblePassword
        ? SIGNUP_INPUT_ELEMENTS.find((item) => item.name === name).icon.openIcon
        : SIGNUP_INPUT_ELEMENTS.find((item) => item.name === name).icon.closeIcon;
      return <img src={src} alt={name} onClick={() => setVisiblePassword(!isVisiblePassword)} />;
    }
    const src = SIGNUP_INPUT_ELEMENTS.find((item) => item.name === name).icon;
    return <img src={src} alt={name} />;
  };

  const getInputIsVisible = (name) => {
    if (name === "detailAddress") {
      return formData.address.length ? true : false;
    }
    return true;
  };

  const getErrorMessage = (name) => {
    return name === "email"
      ? emailErrorStatus.message
      : SIGNUP_INPUT_ELEMENTS.find((item) => item.name === name).errorMessage;
  };

  const getSuccessMessage = (name) => {
    return name === "email" && isEmailDuplicateChecked && "사용 가능한 이메일 입니다";
  };

  const handleChangeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
    handleChangeError(key, false);
  };

  const handleChangeError = (key, value) => {
    setErrors({ ...errors, [key]: value });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    handleChangeFormData(name, value);
    handleChangeError(name, false);

    name === "email" && setEmailDuplicateChecked(false);
    name === "pw" &&
      setPasswordError({
        ...passwordError,
        eng: regexFunc.isEng(value) >= 0,
        pwNum: regexFunc.isPwNum(value) >= 0,
        spe: regexFunc.isSpe(value) >= 0,
        digit: value.length >= 8,
      });
    name === "pwCheck" && value !== formData.pw && handleChangeError("pwCheck", true);
  };

  const handleClickDuplicateCheck = () => {
    setEmailDuplicateChecked(true);
    if (!regexFunc.isEmail(formData.email)) {
      handleChangeError("email", true);
      setEmailErrorStatus(SIGNUP_EMAIL_ERROR_TYPE.regexFailure);
      return;
    }

    const userData = loadLocalStorage(USER_STORAGE);
    const isExistEmail = userData.find((user) => user.email === formData.email);
    if (isExistEmail) {
      handleChangeError("email", true);
      setEmailErrorStatus(SIGNUP_EMAIL_ERROR_TYPE.duplicated);
      return;
    }

    setEmailErrorStatus(SIGNUP_EMAIL_ERROR_TYPE.default);
    handleChangeError("email", false);
  };

  const showModal = (name) => {
    if (name !== "address" && name !== "creditCardNum") {
      return;
    }
    setModalName(name);
    setModalOpen((prev) => !prev);
  };

  const showSelectedModal = () => {
    switch (modalName) {
      case "success":
        return <SignupModal />;
      case "address":
        return (
          <AddressModal
            modalName={modalName}
            toggleModal={setModalOpen}
            onChange={handleChangeFormData}
          />
        );
      case "creditCardNum":
        return (
          <CreditModal
            modalName={modalName}
            toggleModal={setModalOpen}
            onChange={handleChangeFormData}
            creditCard={formData.creditCardNum}
          />
        );
      default:
        return null;
    }
  };

  const validator = {
    authority: (authority) => !(authority === AUTH_LEVEL.unknown),
    email: (email) => regexFunc.isEmail(email) && !(emailErrorStatus.statusCode === 3),
    pw: (pw) => regexFunc.isPassword(pw),
    pwCheck: (pwCheck) => pwCheck === formData.pw,
    name: (name) => regexFunc.isName(name),
    address: (address) => !(address === ""),
    detailAddress: (detailAddress) => !(detailAddress === ""),
    dateOfBirth: (dateOfBirth) => regexFunc.isDateOfBirth(dateOfBirth),
    creditCardNum: (creditCardNum) => regexFunc.isCreditNum(creditCardNum),
  };

  const isAllValid = (data) => {
    for (const name in data) {
      const value = data[name];
      const validateFunction = validator[name];
      if (!validateFunction(value)) {
        handleChangeError(name, true);
        return false;
      }
      handleChangeError(name, false);
    }
    return true;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!isEmailDuplicateChecked) {
      setEmailErrorStatus(SIGNUP_EMAIL_ERROR_TYPE.unConfirmed);
      handleChangeError("email", true);
      return;
    }

    const allValid = isAllValid(formData);
    if (allValid) {
      formData.id = autoIncrementUserId();
      formData.pw = hashSync(formData.pw, 8);
      delete formData.pwCheck;

      const userData = loadLocalStorage(USER_STORAGE);
      userData
        ? saveLocalStorage(USER_STORAGE, [...userData, formData])
        : saveLocalStorage(USER_STORAGE, [formData]);

      setModalOpen((prev) => !prev);
      setModalName("success");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSignupSubmit} passwordError={passwordError}>
        <h4>회원가입</h4>

        <Radio
          name="authority"
          value={formData.authority}
          onChange={handleChangeFormData}
          data={[
            { value: AUTH_LEVEL.teacher, label: "선생님" },
            { value: AUTH_LEVEL.parent, label: "부모님" },
          ]}
          error={errors.authority}
          errorMessage="원하시는 계정 유형을 선택해 주세요."
        />

        {SIGNUP_INPUT_ELEMENTS.map((item, idx) => {
          const { name, placeholder, width, maxLength } = item;
          return (
            <div key={idx} className={`${name}-wrapper`} onClick={() => showModal(name)}>
              <Input
                name={name}
                value={formData[name]}
                placeholder={placeholder}
                width={width}
                maxLength={maxLength}
                type={getInpuType(name)}
                icon={getInputIcon(name)}
                isVisible={getInputIsVisible(name)}
                error={errors[name]}
                errorMessage={getErrorMessage(name)}
                successMessage={getSuccessMessage(name)}
                onChange={handleChangeInput}
              />

              {name === "email" && (
                <Button value="중복확인" width="20%" onClick={handleClickDuplicateCheck} />
              )}
              {name === "pw" && (
                <PasswordPolicy passwordError={passwordError}>
                  {SIGNUP_PASSWORD_POLICY.map((list, idx) => (
                    <span key={idx} className={`password-${list.name}`}>
                      {list.label}
                    </span>
                  ))}
                </PasswordPolicy>
              )}
              {name === "address" && <span>주소검색</span>}
              {name === "creditCardNum" && <span>번호입력</span>}
            </div>
          );
        })}

        <Button type="submit" value="회원가입" marginTop="10px" />
        <Modal isOpen={modalOpen} toggleModal={setModalOpen} modalName={modalName}>
          {modalOpen && showSelectedModal()}
        </Modal>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${({ theme }) => theme.flexSet("center", "center", "column")};
  width: 100%;
  height: calc(100% - 72px);
`;

const OpenModalTextStyle = css`
  position: relative;
  span {
    position: absolute;
    top: 12.5px;
    right: 2px;
    color: ${({ theme }) => theme.color.green};
    font-size: 13px;
    font-weight: 600;
    padding: 10px 50px 13px 0;
    cursor: pointer;
    background-color: white;
  }
  img {
    z-index: 1;
  }
`;

const Form = styled.form`
  width: 600px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.color.borderline};

  h4 {
    font-size: 30px;
    margin-bottom: 20px;
    font-weight: 500;
    text-align: center;
  }
  .email-wrapper {
    ${({ theme }) => theme.flexSet("space-between")};
  }
  .address-wrapper {
    ${OpenModalTextStyle}
  }
  .creditCardNum-wrapper {
    ${OpenModalTextStyle}
  }
`;

const PasswordPolicySuccessStyle = css`
  color: ${({ theme }) => theme.color.green};
  font-weight: 600;
`;

const PasswordPolicy = styled.div`
  ${({ theme }) => theme.flexSet("space-around")};
  span {
    &::before {
      display: inline-block;
      background: url(${checkIcon});
      content: "";
      width: 20px;
      height: 16px;
    }
    color: ${({ theme }) => theme.color.borderline};
    font-size: 15px;
  }
  .password-pwNum {
    ${({ passwordError }) => passwordError.pwNum && PasswordPolicySuccessStyle}
  }
  .password-eng {
    ${({ passwordError }) => passwordError.eng && PasswordPolicySuccessStyle}
  }
  .password-spe {
    ${({ passwordError }) => passwordError.spe && PasswordPolicySuccessStyle}
  }
  .password-digit {
    ${({ passwordError }) => passwordError.digit && PasswordPolicySuccessStyle}
  }
`;

export default SignUp;
