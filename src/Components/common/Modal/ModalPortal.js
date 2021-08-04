import { useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const ModalPortal = ({ toggleModal, children }) => {
  const dropdownRef = useRef(null);
  const handleClick = (e) => {
    if (dropdownRef.current === e.target) {
      toggleModal();
    }
  };

  const elRef = document.getElementById("modalDom");
  return ReactDOM.createPortal(
    <Wrapper ref={dropdownRef} onClick={handleClick}>
      {children}
    </Wrapper>,
    elRef
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;
export default ModalPortal;
