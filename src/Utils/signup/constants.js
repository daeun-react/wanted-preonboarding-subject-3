import { calendar, card, closedEye, openedEye, mail, map, person } from "Assets/svg";
import { AUTH_LEVEL } from "Utils/constants";

export const SIGNUP_ALL_ELEMENTS = [
  { name: "authority", default: AUTH_LEVEL.unknown, error: false },
  { name: "email", default: "", error: false },
  { name: "pw", default: "", error: false },
  { name: "pwCheck", default: "", error: false },
  { name: "name", default: "", error: false },
  { name: "address", default: "", error: false },
  { name: "detailAddress", default: "", error: false },
  { name: "creditCardNum", default: "", error: false },
  { name: "dateOfBirth", default: "", error: false },
];

export const SIGNUP_INPUT_ELEMENTS = [
  {
    name: "email",
    placeholder: "이메일을 입력해주세요",
    errorMessage: "이메일을 다시 입력해주세요",
    successMessage: "사용 가능한 이메일 입니다",
    icon: mail,
    width: "75%",
  },
  {
    name: "pw",
    placeholder: "비밀번호 입력해주세요",
    errorMessage: "비밀번호 다시 입력해주세요",
    successMessage: "",
    icon: { closeIcon: closedEye, openIcon: openedEye },
    width: "100%",
  },
  {
    name: "pwCheck",
    placeholder: "비밀번호 확인을 입력해주세요",
    errorMessage: "비밀번호가 일치하지 않습니다",
    successMessage: "",
    icon: { closeIcon: closedEye, openIcon: openedEye },
    width: "100%",
  },
  {
    name: "name",
    placeholder: "이름을 입력해주세요",
    errorMessage: "이름을 다시 입력해주세요",
    successMessage: "",
    icon: person,
    width: "100%",
  },
  {
    name: "address",
    placeholder: "주소를 입력해주세요",
    errorMessage: "주소를 다시 입력해주세요",
    successMessage: "",
    icon: map,
    width: "100%",
  },
  {
    name: "detailAddress",
    placeholder: "상세주소를 입력해주세요",
    errorMessage: "상세주소를 다시 입력해주세요",
    successMessage: "",
    icon: map,
    width: "100%",
  },
  {
    name: "creditCardNum",
    placeholder: "신용카드 정보를 입력해주세요",
    errorMessage: "신용카드 정보를 다시 입력해주세요",
    successMessage: "",
    icon: card,
    width: "100%",
  },
  {
    name: "dateOfBirth",
    placeholder: "생년월일 6자리를 입력해주세요",
    errorMessage: "생년월일 6자리를 다시 입력해주세요",
    successMessage: "",
    icon: calendar,
    width: "100%",
    maxLength: 6,
  },
];

export const SIGNUP_PASSWORD_POLICY = [
  { name: "pwNum", label: "숫자" },
  { name: "spe", label: "특수문자" },
  { name: "eng", label: "영문" },
  { name: "digit", label: "8자리 이상" },
];

export const SIGNUP_EMAIL_ERROR_TYPE = {
  default: { statusCode: 0, message: "" },
  regexFailure: { statusCode: 1, message: "이메일 형식을 확인해주세요" },
  unConfirmed: { statusCode: 2, message: "중복 검사를 진행해주세요" },
  duplicated: { statusCode: 3, message: "중복된 이메일 입니다" },
};
