import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Titles from '../../Titles/Titles';
import { ModalPopup } from '../../Modal/Modal';
import { setUserInStorage } from '../../../utils/storage';

function TicketHistory(props) {
    const { appliedECs = [], appliedITLIssues = [], isAdmin = false, users } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedAction, setSelectedAction] = useState('');
    const rows = [...appliedECs, ...appliedITLIssues];

    const handleAction = (selectedAction, selectedRow) => {
        setSelectedRow(selectedRow);
        setSelectedAction(selectedAction);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleConfirm = () => {
        const clonedUsers = structuredClone(users);
        const user = clonedUsers.find((user) => user.id === selectedRow.userId);
        const userIndex = clonedUsers.findIndex((user) => user.id === selectedRow.userId);
        clonedUsers.splice(userIndex, 1);
        if (selectedRow.type === 'EC') {
            const userECs = structuredClone(user.appliedECs);
            const selectedEC = userECs.find((ec) => ec.id === selectedRow.id);
            const selectedECIndex = userECs.findIndex((ec) => ec.id === selectedRow.id);
            userECs.splice(selectedECIndex, 1);
            if (selectedEC) {
                selectedEC.status = selectedAction;
            }
            userECs.splice(selectedECIndex, 0, selectedEC);
            user.appliedECs = userECs;
            clonedUsers.splice(userIndex, 0, user);
        } else {
            const userITLs = structuredClone(user.appliedITLIssues);
            const selectedITL = userITLs.find((itl) => itl.id === selectedRow.id);
            const selectedECIndex = userITLs.findIndex((itl) => itl.id === selectedRow.id);
            userITLs.splice(selectedECIndex, 1);
            if (selectedITL) {
                selectedITL.status = selectedAction;
            }
            userITLs.splice(selectedECIndex, 0, selectedITL);
            user.appliedITLIssues = userITLs;
            clonedUsers.splice(userIndex, 0, user);
        }
        setUserInStorage('users', clonedUsers);
        setShowModal(false);
        window.location.reload();
    };

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
                                        {row.status === 'Pending' && (
                                            <>
                                                <Button
                                                    className="m-2"
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleAction('Approved', row)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    className="m-2"
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleAction('Rejected', row)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {
                <ModalPopup
                    showModal={showModal}
                    selectedAction={selectedAction}
                    handleClose={handleClose}
                    handleConfirm={handleConfirm}
                />
            }
        </>
    ) : (
        <Titles title="No Record" text="Please create some EC or ITL issue to see in your history" />
    );
}

export default TicketHistory;
