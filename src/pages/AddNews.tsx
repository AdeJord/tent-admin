// function to add news text and images to the database without firebase. use multer to upload images to the server
// and save the image path to the database.

import 'antd/dist/reset.css'; // or 'antd/dist/antd.less'


import React, { useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddNewsForm = () => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        //If no image, use dangermodal to ask if they want to continue without an image
        console.log('Success:', values);

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        if (values.image[0].originFileObj) {
            formData.append('image', values.image[0].originFileObj);
        }

        // Perform the API call to backend to upload the news item
        try {
            const response = await fetch('/addNews', {
                method: 'POST',
                body: formData, // FormData will be sent correctly with the file
            });
            if (response.ok) {
                console.log("News item added successfully");
                form.resetFields(); // Reset form after successful submission
            } else {
                console.error("Failed to add news item");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <Form
            form={form}
            name="add-news-form"
            onFinish={onFinish}
            autoComplete="off"
            style={{
                padding: '20px',
                width: '90%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the title!' }]}
                style={{
                    width: '60%'
                }}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: 'Please input the content!' }]}
                style={{
                    width: '60%'
                }}
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
                <Upload name="logo" action="/upload.do" listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddNewsForm;


