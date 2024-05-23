import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Resizer from 'react-image-file-resizer';
import { RcFile } from 'antd/es/upload';

const BASE_URL = 'https://adejord.co.uk';

const resizeFile = (file: RcFile): Promise<Blob> =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            800,
            800,
            'JPEG',
            80,
            0,
            (uri) => {
                resolve(uri as Blob);
            },
            'blob'
        );
    });

const submitFormData = async (formData: FormData, form: any, navigate: any) => {
    try {
        const response = await fetch(`${BASE_URL}/addGalleryImage`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log("Image uploaded successfully");
            form.resetFields();  // Clear the form after successful submission
            navigate('/');  // Navigate to the homepage or another route as needed
        } else {
            const errorText = await response.text();
            console.log('Failed Response:', errorText);
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const AddGalleryImages: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: { image: { originFileObj: RcFile }[] }) => {
        const image = values.image[0].originFileObj;
        const resizedImage = await resizeFile(image);

        const formData = new FormData();
        formData.append('file', resizedImage);  // Ensure field name is 'file'
        formData.append('fileType', 'galleryImages');

        await submitFormData(formData, form, navigate);
    };

    const normFile = (e: { fileList: RcFile[] }) => {
        console.log('Upload event:', e);
        return Array.isArray(e) ? e : e && e.fileList;
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            style={{ padding: '20px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <Form.Item
                name="image"
                label="Image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload an image' }]}
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

export default AddGalleryImages;
