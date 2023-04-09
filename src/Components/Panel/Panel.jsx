import { PureComponent } from 'react'
import { createPortal } from 'react-dom';

// import styles of this component
import styles from './Panel.module.css'

// import other component
import UserCard from './UserCard/UserCard'
import UserInformation from './UserInformation/UserInformation'
import UserChangePassword from './UserChangePassword/UserChangePassword'

// import other pkgs
import { UserEdit, Lock, ProfileCircle, Code1 } from "iconsax-react";
import { Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

// import utils
import { getStorage, updateStorage } from './../../utils/storage';
import EC from './EC/EC';
import ITL from './ITL/ITL';
import TicketHistory from './TicketHistory/TicketHistory';

class Panel extends PureComponent {
    constructor(props) {
        super(props);
        this.myVerifyUser = this.getUserFromStorage();

        this.state = {
            user: { ...this.initState(this.myVerifyUser) },
            allUsers: localStorage.getItem('users'),
            toggle: 'student details',
        };

        this.sidebarLinks = this.state.user.isAdmin
            ? [
                  {
                      id: 1,
                      border: false,
                      text: 'Ticket History',
                      active: false,
                  },
              ]
            : [
                  {
                      id: 1,
                      border: true,
                      text: 'Student Details',
                      active: true,
                  },
                  {
                      id: 2,
                      border: true,
                      text: 'Change Password',
                      active: false,
                  },
                  {
                      id: 3,
                      border: true,
                      text: 'Apply for an EC',
                      active: false,
                  },
                  {
                      id: 4,
                      border: true,
                      text: 'Report ITL/EE Issue',
                  },
                  {
                      id: 5,
                      border: false,
                      text: 'Ticket History',
                      active: false,
                  },
              ];
        this.logOut = this.logOut.bind(this);
        this.changeToggle = this.changeToggle.bind(this);
        this.changeUserInformation = this.changeUserInformation.bind(this);
    }

    getUserFromStorage() {
        const users = getStorage('users');
        const userId = getStorage('id');
        const myVerifyUser = users.find((user) => user.id === userId);
        return myVerifyUser;
    }

    initState({
        id,
        username,
        email,
        birthday,
        password,
        isLogin,
        firstName,
        lastName,
        appliedECs,
        appliedITLIssues,
        isAdmin,
    }) {
        return {
            id,
            username,
            email,
            birthday,
            password,
            firstName,
            lastName,
            isLogin,
            appliedECs,
            appliedITLIssues,
            isAdmin,
        };
    }

    logOut() {
        this.changeUserInformation(['isLogin'], [false]);
    }

    componentDidUpdate() {
        updateStorage(getStorage('users'), this.state.user);
        !this.state.user.isLogin && this.props.onLogOut();
    }

    changeToggle(toggle) {
        this.setState({ toggle });
    }

    changeUserInformation(keyInfos, valInfos) {
        let newInfo = {};
        if (keyInfos === 'appliedECs') {
            newInfo.appliedECs = valInfos;
        } else if (keyInfos === 'appliedITLIssues') {
            newInfo.appliedITLIssues = valInfos;
        } else {
            keyInfos.forEach((keyInfo, idx) => (newInfo[keyInfo] = valInfos[idx]));
        }
        this.setState((prev) => {
            return {
                user: {
                    ...prev.user,
                    ...newInfo,
                },
            };
        });
    }
    render() {
        const { user, allUsers } = this.state;

        return (
            <div className={`${styles['panel-wrapper']} d-flex align-items-center justify-content-center`}>
                {/* <div className={styles['bg-overlay']}></div> TODO */}
                <div className={`${styles.container} d-flex justify-content-center align-items-center p-0`}>
                    <Row
                        className={`${styles['panel']} flex-column flex-md-row justify-content-center align-items-center px-3`}
                    >
                        <Col xs={12} sm={8} md={4} className="d-flex flex-column justify-content-center p-0">
                            <UserCard
                                username={user.username}
                                userBirthday={user.birthday}
                                userEmail={user.email}
                                sidebarLinks={this.sidebarLinks}
                                onChangeToggle={this.changeToggle}
                            />
                        </Col>
                        <Col
                            xs={12}
                            sm={8}
                            md={7}
                            className={`${styles['panel-column']} bg-white border mt-5 mt-md-0 ms-md-5 p-5`}
                        >
                            {user.isAdmin ? (
                                <TicketHistory
                                    isAdmin={user.isAdmin}
                                    appliedECs={JSON.parse(allUsers).flatMap((user) =>
                                        user?.appliedECs?.length ? user.appliedECs : [],
                                    )}
                                    appliedITLIssues={JSON.parse(allUsers).flatMap((user) =>
                                        user?.appliedITLIssues?.length ? user.appliedITLIssues : [],
                                    )}
                                    users={JSON.parse(allUsers).flatMap((user) => user)}
                                />
                            ) : (
                                <>
                                    {this.state.toggle === 'student details' && (
                                        <UserInformation
                                            username={user.username}
                                            firstName={user.firstName}
                                            lastName={user.lastName}
                                            email={user.email}
                                            birthday={user.birthday}
                                            onChangeInfo={this.changeUserInformation}
                                        />
                                    )}
                                    {this.state.toggle === 'change password' && (
                                        <UserChangePassword
                                            password={user.password}
                                            onChangeInfo={this.changeUserInformation}
                                        />
                                    )}
                                    {this.state.toggle === 'apply for an ec' && (
                                        <EC
                                            userId={user.id}
                                            appliedECs={user.appliedECs}
                                            onChangeInfo={this.changeUserInformation}
                                        />
                                    )}
                                    {this.state.toggle === 'report itl/ee issue' && (
                                        <ITL
                                            userId={user.id}
                                            appliedITLIssues={user.appliedITLIssues}
                                            onChangeInfo={this.changeUserInformation}
                                        />
                                    )}
                                    {this.state.toggle === 'ticket history' && (
                                        <TicketHistory
                                            appliedECs={user.appliedECs}
                                            appliedITLIssues={user.appliedITLIssues}
                                        />
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </div>
                {createPortal(
                    <Button variant="primary" className={styles['log-out-btn']} onClick={this.logOut}>
                        Log out
                    </Button>,
                    document.getElementById('root'),
                )}
            </div>
        );
    }
}

// validate component
Panel.propTypes = {
    onLogOut: PropTypes.func.isRequired
}

export default Panel
