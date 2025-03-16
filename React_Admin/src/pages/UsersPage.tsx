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

interface DataType {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    role: string;
    avatarUrl: string;
    active: boolean;
}

export default function UsersPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const KEYs = {
        getUsers: () => {
            return ['users', page, limit];
        },
        getUser: (id: string) => {
            return ['user', id];
        }
    };

    const fetchUsers = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/users?page=${page}&limit=${limit}`);
        return response.data;
    };

    const queryUsers = useQuery({
        queryKey: KEYs.getUsers(),
        queryFn: fetchUsers
    });

    const queryClient = useQueryClient();

    const deleteUser = async (id: string) => {
        const response = await axiosClient.delete(`${env.API_URL}/v1/users/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getUsers() });
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
            `${env.API_URL}/v1/users/${id}`,
            payload,
        );
        return response.data;
    };

    const mutationUpdate = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getUsers() });
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
            avatarUrl: values.avatarUrl,
            active: values.active
        });
    };

    const fetchUser = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/users/${selectedId}`);
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
            // Nếu avatarUrl không tồn tại, sử dụng giá trị mặc định
            formEdit.setFieldsValue({
                ...userData,
                avatarUrl: userData.avatarUrl || "https://i.pinimg.com/originals/2a/d9/19/2ad919f562101bd2cbd1b85b78852abf.jpg",
            });
        }
    }, [selectedId, formEdit, queryUser?.data, queryUser.isSuccess]);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Avatar',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            render: (text) => (
                <Avatar 
                    src={text || 'https://i.pinimg.com/originals/2a/d9/19/2ad919f562101bd2cbd1b85b78852abf.jpg'} 
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

    return (
        <>
            {contextHolder}
            <title>User Manager</title>
            <Card
                variant="borderless"
                title="Users List"
                extra={<Button onClick={() => {
                    console.log('Add new user');
                }} icon={<PlusOutlined />} type="primary">Add New</Button>}
            >
                <Flex vertical gap="middle">
                    <Table<DataType>
                        rowKey="_id"
                        loading={queryUsers?.isLoading ?? true}
                        columns={columns}
                        dataSource={queryUsers?.data?.data.users ?? []}
                        pagination={false}
                    />
                    <Pagination
                        align="end"
                        defaultCurrent={1}
                        total={queryUsers?.data?.data.pagination.totalRecord ?? 0}
                        onChange={(page, pageSize) => {
                            navigate(`/users?page=${page}&limit=${pageSize}`);
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
                        name="avatarUrl"
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
        </>
    );
}
