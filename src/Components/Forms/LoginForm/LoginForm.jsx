import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import styles of this component
import styles from '../Forms.module.css';

// import other component
import FormInput from '../FormInput/FormInput';

// import other packages
import { Container, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import PropTypes from 'prop-types';

// import utils
import { getStorage, setUserId, updateStorage } from '../../../utils/storage';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USER_NAME } from '../../../utils/app.constants';

const LoginForm = ({ onRegister, onLogin }) => {
    const [submit, setSubmit] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: object({
            username: string()
                .required('Please enter your username')
                .max(15, 'Your username must be 15 characters or less')
                .min(4, 'Your username must be 4 characters or more'),
            email: string().email('Invalid email').required('Please enter your email'),
            password: string()
                .required('Please enter your password')
                .min(8, 'Your password must be 8 characters or more')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Invalid password'),
        }),
        onSubmit: ({ username, email, password }, { setFieldError }) => {
            const users = getStorage('users');
            let myVerifyUser = null;
            if (username === ADMIN_USER_NAME && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                myVerifyUser = {
                    id: uuidv4(),
                    isAdmin: true,
                    email: ADMIN_EMAIL,
                    firstName: 'Admin',
                    isLogin: true,
                    lastName: 'Admin',
                    password: ADMIN_PASSWORD,
                    username: ADMIN_USER_NAME,
                };
                login(myVerifyUser, true);
            } else {
                myVerifyUser = users && users.find((user) => user.username === username);

                if (users && myVerifyUser) {
                    if (myVerifyUser.email === email && myVerifyUser.password === password) login(myVerifyUser);
                    else if (myVerifyUser.email !== email) setFieldError('Email', `Your email isn't true`);
                    else setFieldError('Password', `Your password isn't correct`);
                } else {
                    setFieldError('Username', 'Your username not found');
                }
            }
        },
    });

    const login = (myVerifyUser, isAdmin = false) => {
        const users = getStorage('users');
        updateStorage(users, myVerifyUser, true, isAdmin);
        setUserId(myVerifyUser.id);
        onLogin();
    };

    return (
        <Container fluid className={`${styles.container} d-flex justify-content-center align-items-center px-5`}>
            <Form noValidate className={styles.form} onSubmit={formik.handleSubmit}>
                <h2>Login</h2>

                <FormInput
                    className="mb-4 mt-5"
                    name="username"
                    controlId="username-input"
                    text="Username"
                    placeholder="Enter your Username"
                    errMsg={formik.errors.username || ''}
                    successMsg=""
                    invalid={submit && formik.errors.username ? true : false}
                    valid={submit && !formik.errors.username ? true : false}
                    {...formik.getFieldProps('username')}
                />

                <FormInput
                    className="mb-4"
                    name="email"
                    controlId="email-input"
                    text="Email"
                    placeholder="Enter your Email"
                    errMsg={formik.errors.email || ''}
                    successMsg=""
                    invalid={submit && formik.errors.email ? true : false}
                    valid={submit && !formik.errors.email ? true : false}
                    {...formik.getFieldProps('email')}
                />

                <FormInput
                    className="mb-4"
                    name="password"
                    controlId="password-input"
                    text="Password"
                    placeholder="Enter your Password"
                    type="password"
                    errMsg={formik.errors.password || ''}
                    successMsg=""
                    invalid={submit && formik.errors.password ? true : false}
                    valid={submit && !formik.errors.password ? true : false}
                    {...formik.getFieldProps('password')}
                />

                <Button
                    onClick={() => onRegister('register')}
                    className="shadow-none mt-4 p-0"
                    type="button"
                    variant=""
                >
                    Need to Register First?
                </Button>

                <Button
                    className={`${styles['submit-btn']} w-100`}
                    onClick={() => setSubmit(true)}
                    disabled={submit && !formik.isValid ? true : false}
                    variant="primary"
                    type="submit"
                >
                    Login
                </Button>
            </Form>
        </Container>
    );
};

// validate the component
LoginForm.propTypes = {
    onRegister: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
