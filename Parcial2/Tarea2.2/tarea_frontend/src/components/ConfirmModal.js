import React from 'react';
import { Modal } from 'react-bootstrap';

function ConfirmModal({ show, onHide, onConfirm, title, message }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cancelar
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Confirmar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
