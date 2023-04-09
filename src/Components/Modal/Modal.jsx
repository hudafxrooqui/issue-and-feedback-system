import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const ModalPopup = ({ showModal, handleClose, handleConfirm, selectedAction }) => {
    return (
        <>
            <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to <b>{selectedAction}</b> this action.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
