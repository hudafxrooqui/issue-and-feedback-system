import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { string, object, ref } from 'yup';
import { FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Titles from '../../Titles/Titles';
import FormInput from '../../Forms/FormInput/FormInput';
import 'react-toastify/dist/ReactToastify.css';

const EC = (props) => {
    const { appliedECs = [], onChangeInfo, userId } = props;
    const [submit, setSubmit] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        validationSchema: object({
            title: string()
                .required('Please enter title')
                .matches(/^(?!\s*$).+/, 'Title cannot be empty'),

            description: string()
                .required('Please enter description')
                .matches(/^(?!\s*$).+/, 'Description cannot be empty'),
        }),
        onSubmit: (values, { resetForm }) => {
            const totalECs = [
                ...appliedECs,
                {
                    id: uuidv4(),
                    title: values.title,
                    description: values.description,
                    type: 'EC',
                    status: 'Pending',
                    userId,
                },
            ];
            onChangeInfo('appliedECs', totalECs);
            toast('Your EC ticket has been successfully submitted!', {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            resetForm();
        },
    });
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
            <Titles title="Submit an EC" text="You can submit your EC ticket here" />
            <Form className="mt-5" noValidate onSubmit={formik.handleSubmit}>
                <FormInput
                    type="Text"
                    className="p-0"
                    inpClass="px-3 py-2"
                    value="LORA"
                    name="title"
                    controlId="title-input"
                    text="Title"
                    placeholder="Enter title"
                    valid={submit && !formik.errors.title ? true : false}
                    errMsg={formik.errors.title || ''}
                    invalid={submit && formik.errors.title ? true : false}
                    successMsg=""
                    {...formik.getFieldProps('title')}
                />
                <FormInput
                    style={{ height: '200px', border: '1px solid black' }}
                    type="description"
                    inpClass="px-3 py-2"
                    className="p-0 mt-3"
                    name="description"
                    controlId="description-input"
                    text="Description"
                    placeholder="Enter your description"
                    valid={submit && !formik.errors.description ? true : false}
                    errMsg={formik.errors.description || ''}
                    invalid={submit && formik.errors.description ? true : false}
                    successMsg=""
                    {...formik.getFieldProps('description')}
                />
                {/* <Form.Control
                    as="textarea"
                    type="description"
                    inpClass="px-3 py-2"
                    className="p-0 mt-3"
                    name="description"
                    controlId="description-input"
                    text="Description"
                    rows="4"
                    placeholder="Enter your description"
                    valid={submit && !formik.errors.description ? true : false}
                    errMsg={formik.errors.description || ''}
                    invalid={submit && formik.errors.description ? true : false}
                    {...formik.getFieldProps('description')}
                /> */}
                <Button
                    variant="primary"
                    disabled={submit && !formik.isValid ? true : false}
                    className="mt-5 py-2 px-4"
                    type="submit"
                    onClick={() => setSubmit(true)}
                >
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default EC;
