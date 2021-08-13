# 자란다 기업 과제 (Team 7ill Resource)

### [2021.08.13 - 이다은] 
- fork 후, 회원가입 페이지에 대한 리팩토링을 진행하였습니다.

## [🔗 배포 링크](https://naughty-curie-d72f2a.netlify.app/)

## UI 미리 보기

[🔗 기능별 영상 및 사진 스크린샷 위키 페이지](https://github.com/SeongsangCHO/wanted-preonboarding-subject-3/wiki/%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B3%84-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7)


## 권한 별 계정 정보 및 접근 가능한 페이지 목록

- 계정으로 접속하신 후 링크를 클릭하시면 확인하실 수 있습니다.

#### 관리자계정

- 모든 페이지 접근 가능(`/admin`, `/teacher`, `/kids`, `/students`, `/matchup`)
- ID: [admin@gmail.com](mailto:admin@gmail.com)
- PW: 1q2w3e4r!

✅   [관리자페이지-가능](https://naughty-curie-d72f2a.netlify.app/admin)

✅   [부모님 관련페이지1-접근가능](https://naughty-curie-d72f2a.netlify.app/teacher)

✅   [부모님 관련페이지2-접근가능](https://naughty-curie-d72f2a.netlify.app/kids)

✅   [선생님 관련페이지1-접근가능](https://naughty-curie-d72f2a.netlify.app/students)

✅   [선생님 관련페이지2-접근가능](https://naughty-curie-d72f2a.netlify.app/matchup)


---


#### 선생님계정

- 관리자 페이지를 제외한 모든 페이지(`/teacher`, `/kids`, `/students`, `/matchup`)
- ID: [teacher@gmail.com](mailto:admin@gmail.com)
- PW: 1q2w3e4r!

❌   [관리자페이지-접근불가](https://naughty-curie-d72f2a.netlify.app/admin)

✅   [부모님 관련페이지1-접근가능](https://naughty-curie-d72f2a.netlify.app/teacher)

✅   [부모님 관련페이지2-접근가능](https://naughty-curie-d72f2a.netlify.app/kids)

✅   [선생님 관련페이지1-접근가능](https://naughty-curie-d72f2a.netlify.app/matchup)

✅   [선생님 관련페이지2-접근가능](https://naughty-curie-d72f2a.netlify.app/students)


---

#### 부모님계정

- 관리자, 선생님 페이지를 제외한 모든 페이지 (`/teacher`, `/kids`)
- ID: [parents@gmail.com](mailto:parents@gmail.com)
- PW: 1q2w3e4r!

❌   [관리자페이지-접근불가](https://naughty-curie-d72f2a.netlify.app/admin)

❌   [선생님 관련페이지1-접근불가](https://naughty-curie-d72f2a.netlify.app/students)

❌   [선생님 관련페이지2-접근불가](https://naughty-curie-d72f2a.netlify.app/matchup)

✅   [부모님 관련페이지1-접근가능](https://naughty-curie-d72f2a.netlify.app/teacher)

✅   [부모님 관련페이지2-접근가능](https://naughty-curie-d72f2a.netlify.app/kids)

---


## 팀원 별 분담한 기능

### [강보현](https://github.com/bohyunkang) & [박현정](https://github.com/imhjlov) & [이다은](https://github.com/daeun-react)

#### 메인 / 로그인 / 회원가입 페이지

##### ✅ 마크업 및 스타일링

- 메인 / 로그인 / 회원가입 페이지
- Header
- Navigation Bar
- Modal
- Input(Text)
- Input(Radio)
- Button
- MessageBox

##### ✅ 로그인, 회원가입 페이지 기능 구현

- form 입력 데이터 유효성 검사
- 패스워드 암호화 처리(bcrypt.js)
- 모달 팝업 기능 구현
  - 주소 입력 모달 창 다음 지도 API 연동(react-daum-postcode)
  - 신용 카드 입력 모달 창

##### ✅ 유저 데이터 로컬 스토리지 연동

- 이메일 중복 확인
- Header 로그인 여부 판단 후 조건부 렌더링

### [김남주](https://github.com/skawnkk) & [박현찬](https://github.com/Eyes0n) & [조성상](https://github.com/SeongsangCHO)

#### 관리자 페이지

##### ✅ 권한 조건

- 권한 필터 기능( 부모님, 선생님, 관리자 )
- 권한 변경 설정 기능

##### ✅ 테이블

- 테이블 스타일링
- 유저 데이터가 없을 때 조건 처리
- 각 페이지마다 10개씩 유저 데이터 출력

##### ✅ 페이지네이션

- 페이지네이션 스타일링
- 페이지네이션 버튼 출력 10개 고정 출력
- 현재 조회 중인 페이지 버튼 중앙 위치 설정

##### ✅ 검색 및 필터 조건

- 이메일, 이름 키워드에 따른 검색 기능
- 검색 키워드와 권한 조건 조합에 따른 검색 기능
- 검색 키워드 초기화, 필터 전체 조건 클릭 기능 추가

### [김민기](https://github.com/mong-byte) & [한우빈](https://github.com/hwb0218)

#### 관리자 페이지

##### ✅ 권한

- 유저의 권한에 따른 접근 제한, 리다이렉트 구현
- 로그인 한 유저의 권한에 따른 다른 메뉴 출력 구현
- 권한에 따른 Extra 페이지 출력

##### ✅ Utils

- Utils 영역 상수 작성
- Utils 영역 로컬스토리지 관련 함수 작성

##### ✅ 관리자 페이지

- 관리자 페이지 계정 생성 모달 스타일링
- 관리자 페이지 계정 생성 로직 구현

## 프로젝트 더 자세히 알아보기
[🔗 팀 7ill Resource 마무리 회고](https://bohyunkang.notion.site/8-6-Project-94fb2d99a1c346ecbf0b1ac3cb01414f)

[🔗 팀 7ill Resource 미팅 로그](https://bohyunkang.notion.site/7ill-Resource-2f8ec63f3a9048418eaa18269cc9bfb8)

[🔗 프로젝트 칸반보드](https://github.com/SeongsangCHO/wanted-preonboarding-subject-3/projects/1)

[🔗 피그마 링크](https://www.figma.com/file/BV3d2knhk0j275H0kLQnRs/%EC%9E%90%EB%9E%80%EB%8B%A4-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85-UI-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0%3A1)
