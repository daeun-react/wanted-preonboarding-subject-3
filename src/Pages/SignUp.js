import React, { useState } from "react";
import styled, { css } from "styled-components";

import * as regexFunc from "Utils/validator.js";
import { hashSync } from "Utils/bcrypt";
import { AUTH_LEVEL, USER_STORAGE } from "Utils/constants";
import { loadLocalStorage, saveLocalStorage, autoIncrementUserId } from "Utils/Storage";

import { Button, Input, Radio } from "Components/common";
import { Modal, AddressModal, CreditModal, SignupModal } from "Components/common/Modal";
import { Calendar, Card, ClosedEye, OpenedEye, Mail, Map, Person, checkIcon } from "Assets/svg";

const SignUp = () => {
  const [modalType, setModalType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [emailDuplicateStatus, setEmailDuplicateStatus] = useState(SIGNUP_EMAIL_STATUS.default);
  const [emailDuplicateChecked, setEmailDuplicateChecked] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [passwordCheckError, setPasswordCheckError] = useState(false);
  const [passwordError, setPasswordError] = useState({
    pwNum: false,
    eng: false,
    spe: false,
    digit: false,
  });
  const [formData, setFormData] = useState({
    authority: AUTH_LEVEL.unknown,
    email: "",
    pw: "",
    pwCheck: "",
    name: "",
    address: "",
    detailAddress: "",
    creditCardNum: "",
    dateOfBirth: "",
  });

  const initialState = {
    authority: false,
    email: false,
    pw: false,
    pwCheck: false,
    name: false,
    address: false,
    detailAddress: false,
    creditCardNum: false,
    dateOfBirth: false,
  };
  const [errors, setErrors] = useState(initialState);

  const validator = {
    authority: (authority) => !(authority === AUTH_LEVEL.unknown),
    email: (email) => regexFunc.isEmail(email),
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

  const handleClickDuplicateCheck = () => {
    setEmailDuplicateChecked(true);

    if (!regexFunc.isEmail(formData.email)) {
      setErrors({ ...errors, email: true });
      setEmailDuplicateStatus(SIGNUP_EMAIL_STATUS.invalidType);
      return;
    }

    const userData = loadLocalStorage(USER_STORAGE);
    if (!userData) {
      setErrors({ ...errors, email: false });
      setEmailDuplicateStatus(SIGNUP_EMAIL_STATUS.confirmedSuccess);
      return;
    }

    const searchEmail = userData.filter((user) => user.email === formData.email);
    if (searchEmail.length) {
      setErrors({ ...errors, email: true });
      setEmailDuplicateStatus(SIGNUP_EMAIL_STATUS.confirmedFailure);
    } else {
      setErrors({ ...errors, email: false });
      setEmailDuplicateStatus(SIGNUP_EMAIL_STATUS.confirmedSuccess);
    }
  };

  const getEmailStatusMessage = (status) => {
    let message = errors.email ? "이메일을 입력하세요" : "";
    if (status === SIGNUP_EMAIL_STATUS.invalidType) message = "이메일 형식을 확인해주세요";
    else if (status === SIGNUP_EMAIL_STATUS.unConfirmed) message = "중복 검사를 진행해주세요";
    else if (status === SIGNUP_EMAIL_STATUS.confirmedFailure) message = "중복된 이메일 입니다.";
    return message;
  };

  const toggleModal = (modal) => {
    setModalOpen(!modalOpen);
    setModalType(modal);
  };

  const handleSetAuthority = (authority) => {
    setErrors(initialState);
    setFormData({
      ...formData,
      authority,
    });
  };

  const handleSetAddressValue = (address) => {
    setErrors(initialState);
    setFormData({
      ...formData,
      address,
    });
  };

  const handleSetCardNum = (creditCardNum) => {
    setErrors(initialState);
    setFormData({
      ...formData,
      creditCardNum,
    });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setErrors(initialState);

    if (name === "email") {
      setEmailDuplicateChecked(false);
    }

    if (name === "pw") {
      setPasswordError({
        ...passwordError,
        eng: regexFunc.isEng(value) >= 0,
        pwNum: regexFunc.isPwNum(value) >= 0,
        spe: regexFunc.isSpe(value) >= 0,
        digit: value.length >= 8,
      });
    }

    if (name === "pwCheck") {
      setPasswordCheckError(value !== formData.pw);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!emailDuplicateChecked) {
      setErrors((prev) => ({
        ...prev,
        email: true,
      }));
      setEmailDuplicateStatus(SIGNUP_EMAIL_STATUS.unConfirmed);
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
      toggleModal("success");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSignupSubmit} passwordError={passwordError}>
        <h4>회원가입</h4>

        <Radio
          name="authority"
          value={formData.authority}
          onChange={handleSetAuthority}
          data={[
            { value: AUTH_LEVEL.teacher, label: "선생님" },
            { value: AUTH_LEVEL.parent, label: "부모님" },
          ]}
          error={errors.authority}
          errorMessage="원하시는 계정 유형을 선택해 주세요."
        />

        <EmailWrapper>
          <Input
            name="email"
            value={formData.email}
            onChange={handleSignUpChange}
            placeholder="이메일을 입력하세요"
            icon={<Mail />}
            error={errors.email}
            errorMessage={getEmailStatusMessage(emailDuplicateStatus)}
            successMessage={emailDuplicateChecked && "사용 가능한 이메일 입니다"}
            width="75%"
          />
          <Button value="중복확인" width="20%" onClick={handleClickDuplicateCheck} />
        </EmailWrapper>

        <Input
          name="pw"
          value={formData.pw}
          onChange={handleSignUpChange}
          placeholder="비밀번호를 입력하세요"
          type={visiblePassword ? "password" : "text"}
          icon={
            visiblePassword ? (
              <ClosedEye onClick={() => setVisiblePassword(!visiblePassword)} />
            ) : (
              <OpenedEye onClick={() => setVisiblePassword(!visiblePassword)} />
            )
          }
          error={errors.pw}
          errorMessage="비밀번호를 다시 입력해 주세요"
        />

        <PasswordPolicy passwordError={passwordError}>
          <div>
            <span className="password-pwNum">숫자</span>
          </div>
          <div>
            <span className="password-spe">특수문자</span>
          </div>
          <div>
            <span className="password-eng">영문</span>
          </div>
          <div>
            <span className="password-digit">8자리 이상</span>
          </div>
        </PasswordPolicy>

        <Input
          name="pwCheck"
          value={formData.pwCheck}
          onChange={handleSignUpChange}
          placeholder="비밀번호를 다시 입력하세요"
          type={visiblePassword ? "password" : "text"}
          icon={
            visiblePassword ? (
              <ClosedEye onClick={() => setVisiblePassword(!visiblePassword)} />
            ) : (
              <OpenedEye onClick={() => setVisiblePassword(!visiblePassword)} />
            )
          }
          error={passwordCheckError}
          errorMessage="비밀번호를 다시 입력해 주세요"
        />

        <Input
          name="name"
          value={formData.name}
          onChange={handleSignUpChange}
          placeholder="이름을 입력하세요"
          icon={<Person />}
          error={errors.name}
          errorMessage="이름을 다시 입력해 주세요"
        />

        <AddressWrapper>
          <div className="address-main" onClick={() => toggleModal("address")}>
            <Input
              name="address"
              value={formData.address}
              placeholder="주소를 입력하세요"
              icon={<Map />}
              error={errors.address}
              errorMessage="주소를 다시 입력해 주세요"
            />
            <span>주소검색</span>
          </div>
          {formData.address && (
            <Input
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleSignUpChange}
              placeholder="상세주소를 입력하세요"
              icon={<Map />}
              error={errors.detailAddress}
              errorMessage="상세주소를 다시 입력해 주세요"
            />
          )}
        </AddressWrapper>

        <CreditCardWrapper onClick={() => toggleModal("credit")}>
          <Input
            name="creditCardNum"
            value={formData.creditCardNum}
            placeholder="신용카드 정보를 입력하세요"
            icon={<Card />}
            error={errors.creditCardNum}
            errorMessage="카드번호를 다시 입력해 주세요"
          />
          <span>번호입력</span>
        </CreditCardWrapper>

        <Input
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleSignUpChange}
          placeholder="생년월일 6자리를 입력하세요"
          icon={<Calendar />}
          error={errors.dateOfBirth}
          maxLength={6}
          errorMessage="생년월일을 다시 입력해 주세요"
        />

        <Button type="submit" value="회원가입" marginTop="10px" />

        <Modal isOpen={modalOpen} toggleModal={toggleModal} modalType={modalType}>
          <>
            {modalType === "success" && <SignupModal />}
            {modalType === "address" && (
              <AddressModal toggleModal={toggleModal} onSelected={handleSetAddressValue} />
            )}
            {modalType === "credit" && (
              <CreditModal
                creditCard={formData.creditCardNum}
                handleSetCardNum={handleSetCardNum}
                toggleModal={toggleModal}
              />
            )}
          </>
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 0;
  }
`;

const EmailWrapper = styled.div`
  ${({ theme }) => theme.flexSet("space-between")};
`;

const PasswordPolicy = styled.div`
  ${({ theme }) => theme.flexSet("space-around")};

  > div {
    span {
      color: ${({ theme }) => theme.color.borderline};
      text-align: center;
      font-size: 15px;
    }
    &::before {
      display: inline-block;
      background: url(${checkIcon});
      content: "";
      width: 20px;
      height: 16px;
    }
    .password-pwNum {
      ${(props) =>
        props.passwordError.pwNum &&
        css`
          color: ${({ theme }) => theme.color.green};
          font-weight: 600;
        `};
    }
    .password-eng {
      ${(props) =>
        props.passwordError.eng &&
        css`
          color: ${({ theme }) => theme.color.green};
          font-weight: 600;
        `};
    }
    .password-spe {
      ${(props) =>
        props.passwordError.spe &&
        css`
          color: ${({ theme }) => theme.color.green};
          font-weight: 600;
        `};
    }
    .password-digit {
      ${(props) =>
        props.passwordError.digit &&
        css`
          color: ${({ theme }) => theme.color.green};
          font-weight: 600;
        `};
    }
  }
`;

const AddressWrapper = styled.div`
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
  svg {
    z-index: 1;
  }
`;

const CreditCardWrapper = styled.div`
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
  svg {
    z-index: 1;
  }
`;

const SIGNUP_EMAIL_STATUS = {
  default: 0,
  invalidType: 1,
  unConfirmed: 2,
  confirmedFailure: 3,
  confirmedSuccess: 4,
};

export default SignUp;
