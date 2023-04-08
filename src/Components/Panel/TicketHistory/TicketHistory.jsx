import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Titles from '../../Titles/Titles';
import { ModalPopup } from '../../Modal/Modal';

function TicketHistory(props) {
    const { appliedECs = [], appliedITLIssues = [], isAdmin = false } = props;
    const [showModal, setShowModal] = useState(false);
    const rows = [...appliedECs, ...appliedITLIssues];
    const handleAction = (selectedAction) => {
        console.log(selectedAction);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleConfirm = () => setShowModal(false);

    return rows.length ? (
        <>
            <Titles title="Ticket History" text="You can view your history here for EC and ITS tickets" />
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        {isAdmin && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.type}</td>
                                <td>{row.title}</td>
                                <td>{row.description}</td>
                                <td>{row.status}</td>
                                {isAdmin && (
                                    <td>
                                        <Button
                                            className="m-2"
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleAction('approve')}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            className="m-2"
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleAction('reject')}
                                        >
                                            Reject
                                        </Button>
                                        {/* <ModalPopup /> */}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {<ModalPopup showModal={showModal} handleClose={handleClose} handleConfirm={handleConfirm} />}
        </>
    ) : (
        <Titles title="No Record" text="Please create some EC or ITL issue to see in your history" />
    );
}

export default TicketHistory;
