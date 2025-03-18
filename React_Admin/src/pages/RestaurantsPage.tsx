import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Form, Input, message, Modal, Pagination, Popconfirm, Space, Table, Select, Switch } from "antd"; // Added Select and Switch import
import type { TableProps, FormProps } from 'antd';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { axiosClient } from "../libs/axiosClient";
import { env } from "../constants/getEnvs";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from 'axios'; // Ensure axios is imported for type narrowing

interface DataType {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    role: string;
    avatar: string; // Changed from avatarUrl to avatar
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function RestaurentsPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const KEYs = {
        getrestaurents: () => {
            return ['restaurents', page, limit];
        },
        getUser: (id: string) => {
            return ['user', id];
        }
    };

    const fetchrestaurents = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/restaurents?page=${page}&limit=${limit}`);
        return response.data;
    };

    const queryrestaurents = useQuery({
        queryKey: KEYs.getrestaurents(),
        queryFn: fetchrestaurents
    });

    const queryClient = useQueryClient();

    const deleteUser = async (id: string) => {
        const response = await axiosClient.delete(`${env.API_URL}/v1/restaurents/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getrestaurents() });
            messageApi.open({
                type: 'success',
                content: 'User deleted successfully!',
            });
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Failed to delete user!',
            });
        }
    });

    const [formEdit] = Form.useForm();
    const [selectedId, setSelectedId] = useState<string>('');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const updateUser = async (formData: DataType & { id: string }) => { // Replaced 'any' with specific type
        const { id, ...payload } = formData;
        const response = await axiosClient.put(
            `${env.API_URL}/v1/restaurents/${id}`,
{
                ...payload,
avatar: payload.avatar || "https://example.com/new-default-avatar.jpg", // Ensure avatar is included
            },
        );
        return response.data;
    };

    const mutationUpdate = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getrestaurents() });
            queryClient.invalidateQueries({ queryKey: KEYs.getUser(selectedId) });
            messageApi.open({
                type: 'success',
                content: 'User updated successfully!',
            });
            setIsModalEditOpen(false);
            formEdit.resetFields();
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Failed to update user!',
            });
        }
    });

    const onFinishEdit: FormProps<DataType>['onFinish'] = async (values) => {
        await mutationUpdate.mutateAsync({
            id: selectedId,
            _id: selectedId, // Added '_id' to match the DataType structure
            username: values.username,
            email: values.email,
            fullname: values.fullname,
            role: values.role,
            avatar: values.avatar,
            active: values.active,
            createdAt: values.createdAt, // Corrected typo
            updatedAt: values.updatedAt, // Corrected typo
        });
    };

    const fetchUser = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/restaurents/${selectedId}`);
        return response.data;
    };

    const queryUser = useQuery({
        queryKey: KEYs.getUser(selectedId),
        queryFn: fetchUser,
        enabled: selectedId !== '' && isModalEditOpen === true
    });

    useEffect(() => {
        if (queryUser.isSuccess && queryUser.data) {
            const userData = queryUser?.data?.data;
            // Nếu avatar không tồn tại, sử dụng giá trị mặc định mới
            formEdit.setFieldsValue({
                ...userData,
                avatar: userData.avatar || "https://example.com/new-default-avatar.jpg",
            });
        }
    }, [selectedId, formEdit, queryUser?.data, queryUser.isSuccess]);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text) => (
                <Avatar 
                    src={text || 'https://example.com/new-default-avatar.jpg'} // Updated to use avatar field 
                />
            ),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
       
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(), // Format ngày
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => new Date(text).toLocaleString(), // Format ngày
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (text, record) => (
                <Switch
                    checked={record.active}
                    onChange={async (checked) => {
                        await mutationUpdate.mutateAsync({
                            ...record,
                            active: checked,
                            id: record._id
                        });
                    }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {
                        setSelectedId(record._id);
                        setIsModalEditOpen(true);
                    }} icon={<EditOutlined />} />
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={async () => {
                            mutationDelete.mutate(record._id);
                        }}
                        okButtonProps={{ loading: mutationDelete.isPending }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="dashed" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },

        
    ];

    const [formAdd] = Form.useForm();
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const addUser = async (formData: Omit<DataType, '_id'> & { password: string }) => {
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                role: formData.role,
                avatar: formData.avatar || "https://example.com/new-default-avatar.jpg", // Updated default avatar
                active: formData.active ?? false, // Default active state
                password: formData.password, // Include password in the payload
            };
            console.log('Payload being sent:', payload); // Log the payload for debugging
            const response = await axiosClient.post(`${env.API_URL}/v1/restaurents`, payload);
            console.log('Server response:', response.data); // Log the server response
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error adding user:', error.response?.data || error.message); // Log detailed error
                throw new Error(error.response?.data?.message || 'Failed to add user');
            } else {
                console.error('Unexpected error:', error); // Handle non-Axios errors
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const mutationAdd = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getrestaurents() });
            messageApi.open({
                type: 'success',
                content: 'User added successfully!',
            });
            setIsModalAddOpen(false);
            formAdd.resetFields();
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error('Add user error:', error.response?.data || error.message); // Log server error
                messageApi.open({
                    type: 'error',
                    content: `Failed to add user: ${error.response?.data?.message || 'Internal Server Error'}`,
                });
            } else {
                console.error('Unexpected error:', error); // Handle non-Axios errors
                messageApi.open({
                    type: 'error',
                    content: 'An unexpected error occurred while adding the user.',
                });
            }
        }
    });

    const onFinishAdd: FormProps<Omit<DataType, '_id'> & { password: string }>['onFinish'] = async (values) => {
        await mutationAdd.mutateAsync(values);
    };

    return (
        <>
            {contextHolder}
            <title>User Manager</title>
            <Card
                variant="borderless"
                title="restaurents List"
                extra={<Button onClick={() => setIsModalAddOpen(true)} icon={<PlusOutlined />} type="primary">Add New</Button>}
            >
                <Flex vertical gap="middle">
                    <Table<DataType>
                        rowKey="_id"
                        loading={queryrestaurents?.isLoading ?? true}
                        columns={columns}
                        dataSource={queryrestaurents?.data?.data.restaurents ?? []}
                        pagination={false}
                    />
                    <Pagination
                        align="end"
                        defaultCurrent={1}
                        total={queryrestaurents?.data?.data.pagination.totalRecord ?? 0}
                        onChange={(page, pageSize) => {
                            navigate(`/restaurents?page=${page}&limit=${pageSize}`);
                        }}
                    />
                </Flex>
            </Card>
            <Modal
                title="Edit User"
                centered
                open={isModalEditOpen}
                onOk={() => {
                    formEdit.submit();
                }}
                onCancel={() => setIsModalEditOpen(false)}
            >
                <Form
                    name="formEdit"
                    form={formEdit}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{}}
                    onFinish={onFinishEdit}
                    autoComplete="off"
                >
                    <Form.Item<DataType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input the username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<DataType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<DataType>
                        label="Full Name"
                        name="fullname"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<DataType>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select>
                            <Select.Option value="customer">Customer</Select.Option>
                            <Select.Option value="restaurant_owner">Restaurant Owner</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item<DataType>
                        label="Avatar URL"
                        name="avatar"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<DataType>
                        label="Active"
                        name="active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add User"
                centered
                open={isModalAddOpen}
                onOk={() => {
                    formAdd.submit();
                }}
                onCancel={() => setIsModalAddOpen(false)}
            >
                <Form
                    name="formAdd"
                    form={formAdd}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{}} // No pre-filled values
                    onFinish={onFinishAdd}
                    autoComplete="off"
                >
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input the username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Full Name"
                        name="fullname"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select>
                            <Select.Option value="customer">Customer</Select.Option>
                            <Select.Option value="restaurant_owner">Restaurant Owner</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Avatar URL"
                        name="avatar"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<Omit<DataType, '_id'> & { password: string }>
                        label="Active"
                        name="active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}