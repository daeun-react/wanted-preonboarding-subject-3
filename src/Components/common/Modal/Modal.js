import React from "react";
import ModalPortal from "Components/common/Modal/ModalPortal";

const Modal = ({ isOpen, toggleModal, modalName = null, children }) => {
  return (
    <>
      {isOpen && (
        <ModalPortal toggleModal={toggleModal} modalName={modalName}>
          {children}
        </ModalPortal>
      )}
    </>
  );
};

export default Modal;
