import React from 'react';
import { createPortal } from 'react-dom';
import { ModalBody, Header } from '../../Assets/styled/callModal';
function CallModal({ is_opened, children, header, height, width }) {
  const portal = document.getElementById('portal');

  return createPortal(
    <>
      <ModalBody height={height} width={width} is_opened={is_opened}>
        <Header>{header}</Header>
        {children}
      </ModalBody>
    </>,
    portal
  );
}

export default CallModal;
