import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const AddNewsForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const BASE_URL = 'https://adejord.co.uk';

    const onFinish = async (values: { title: string | Blob; content: string | Blob; image: string | any[]; }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('date', new Date().toISOString());

        if (values.image && values.image.length > 0) {
            formData.append('fileType', 'newsImage');  // Specify the file type as news image
            formData.append('image', values.image[0].originFileObj);
        } else {
            // Confirm if they want to proceed without an image
            Modal.confirm({
                title: 'Are you sure you want to continue without an image?',
                onOk: () => submitFormData(formData),
            });
            return;
        }
        submitFormData(formData);
    };


    const submitFormData = async (formData: FormData) => {
        try {
            const response = await fetch(`${BASE_URL}/addNews`, {
                method: 'POST',
                body: formData,  // Ensuring the formData is passed correctly
            });
    
            // First, check if the response is okay
            if (response.ok) {
                console.log("News item added successfully");
                console.log('From Data:', formData);
                // Check the content type to decide how to process it
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    // Read the response as JSON if it's JSON
                    const responseData = await response.json();
                    console.log('Response Data:', responseData);
                } else {
                    // If not JSON, read as text
                    const responseText = await response.text(); // Read only once here
                    console.log('Non-JSON Response:', responseText);
                }
    
                form.resetFields();  // Clear the form after successful submission
                navigate('/');  // Navigate to the homepage or another route as needed
            } else {
                // If the server response is not OK, log and handle it
                const errorText = await response.text();  // Read the response as text to log it
                console.log('Failed Response:', errorText);
                throw new Error('Failed to submit news item');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const normFile = (e: { fileList: any[]; }) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    

    return (
        <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            style={{ padding: '20px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the title!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: 'Please input the content!' }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="image"
                label="Image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Select image to upload"
            >
                <Upload name="image" listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default AddNewsForm;
