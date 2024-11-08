import React from 'react';
import { createPortal } from 'react-dom';
import {
  ModalContainer,
  ModalBody,
  Header,
  CloseIcon,
} from '../../Assets/styled/modal';
import { AiOutlineClose } from 'react-icons/ai';
function Modal({
  is_opened,
  close_modal,
  children,
  header,
  height,
  width,
  style,
}) {
  const portal = document.getElementById('portal');

  return createPortal(
    <>
      <ModalContainer
        onClick={() => {
          close_modal();
        }}
        is_opened={is_opened}
      ></ModalContainer>
      <ModalBody
        style={style}
        height={height}
        width={width}
        is_opened={is_opened}
      >
        <Header>{header}</Header>
        <CloseIcon onClick={close_modal}>
          <AiOutlineClose color="#00bfa6" size="20" />
        </CloseIcon>
        {children}
      </ModalBody>
    </>,
    portal
  );
}

export default Modal;
