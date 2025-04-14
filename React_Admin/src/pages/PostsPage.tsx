import { DeleteOutlined, EditOutlined, PlusOutlined, LikeOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Form, Input, message, Modal, Pagination, Popconfirm, Space, Table, Select, Switch, Image } from "antd";
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

interface PostType {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        fullname: string;
        avatar: string | null;
    };
    title: string;
    content: string;
    images: string[];
    restaurant_id: string;
    is_active: boolean;
    likes: Array<{
        _id: string;
        post: {
            id: string;
            title: string;
            content: string;
        };
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        createdAt: string;
        updatedAt: string;
    }>;
    comments: Array<{
        _id: string;
        content: string;
        createdAt: string;
    }>;
    viewCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function PostsPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const KEYs = {
        getPosts: () => {
            return ['posts', page, limit];
        },
        getPost: (id: string) => {
            return ['post', id];
        }
    };

    const fetchPosts = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/posts?page=${page}&limit=${limit}`);
        return response.data;
    };

    const queryPosts = useQuery({
        queryKey: KEYs.getPosts(),
        queryFn: fetchPosts
    });

    const queryClient = useQueryClient();

    const deletePost = async (id: string) => {
        const response = await axiosClient.delete(`${env.API_URL}/v1/posts/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getPosts() });
            messageApi.open({
                type: 'success',
                content: 'Post deleted successfully!',
            });
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Failed to delete post!',
            });
        }
    });

    const [formEdit] = Form.useForm();
    const [selectedId, setSelectedId] = useState<string>('');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const updatePost = async (formData: PostType) => {
        const response = await axiosClient.put(
            `${env.API_URL}/v1/posts/${formData._id}`,
            {
                title: formData.title,
                content: formData.content,
                images: formData.images,
                restaurant_id: formData.restaurant_id,
                is_active: formData.is_active
            }
        );
        return response.data;
    };

    const mutationUpdate = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getPosts() });
            queryClient.invalidateQueries({ queryKey: KEYs.getPost(selectedId) });
            messageApi.open({
                type: 'success',
                content: 'Post updated successfully!',
            });
            setIsModalEditOpen(false);
            formEdit.resetFields();
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            messageApi.open({
                type: 'error',
                content: error.response?.data?.message || 'Failed to update post!',
            });
        }
    });

    const onFinishEdit: FormProps<PostType>['onFinish'] = async (values) => {
        await mutationUpdate.mutateAsync({
            ...values,
            _id: selectedId
        });
    };

    const fetchPost = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/posts/${selectedId}`);
        return response.data;
    };

    const queryPost = useQuery({
        queryKey: KEYs.getPost(selectedId),
        queryFn: fetchPost,
        enabled: selectedId !== '' && isModalEditOpen === true
    });

    useEffect(() => {
        if (queryPost.isSuccess && queryPost.data) {
            formEdit.setFieldsValue(queryPost.data.data);
        }
    }, [selectedId, formEdit, queryPost.data, queryPost.isSuccess]);

    const columns: TableProps<PostType>['columns'] = [
        {
            title: 'Author',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (user) => (
                <Space>
                    <Avatar 
                        src={user?.avatar || 'https://via.placeholder.com/40'}
                        size={40}
                    />
                    <span>{user?.fullname || 'Unknown'}</span>
                </Space>
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => text.substring(0, 100) + '...',
        },
        {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            render: (images: string[]) => (
                <Space>
                    {images.slice(0, 3).map((image: string, index: number) => (
                        <Image key={index} src={image} width={50} height={50} preview={{ mask: false }} />
                    ))}
                </Space>
            ),
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes',
            render: (likes) => likes.length,
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (comments) => comments.length,
        },
        {
            title: 'Views',
            dataIndex: 'viewCount',
            key: 'viewCount',
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text, record) => (
                <Switch
                    checked={record.is_active}
                    onChange={async (checked) => {
                        await mutationUpdate.mutateAsync({
                            ...record,
                            is_active: checked
                        });
                    }}
                />
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
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
                        title="Delete the post"
                        description="Are you sure to delete this post?"
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

    const addPost = async (formData: Omit<PostType, '_id'>) => {
        const response = await axiosClient.post(`${env.API_URL}/v1/posts`, {
            title: formData.title,
            content: formData.content,
            images: formData.images,
            restaurant_id: formData.restaurant_id,
            is_active: formData.is_active
        });
        return response.data;
    };

    const mutationAdd = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getPosts() });
            messageApi.open({
                type: 'success',
                content: 'Post added successfully!',
            });
            setIsModalAddOpen(false);
            formAdd.resetFields();
        },
        onError: (error: any) => {
            console.error('Add error:', error);
            messageApi.open({
                type: 'error',
                content: error.response?.data?.message || 'Failed to add post!',
            });
        }
    });

    const onFinishAdd: FormProps<Omit<PostType, '_id'>>['onFinish'] = async (values) => {
        await mutationAdd.mutateAsync(values);
    };

    return (
        <>
            {contextHolder}
            <title>Posts Manager</title>
            <Card
                variant="borderless"
                title="Posts List"
                extra={<Button onClick={() => setIsModalAddOpen(true)} icon={<PlusOutlined />} type="primary">Add New</Button>}
            >
                <Flex vertical gap="middle">
                    <Table<PostType>
                        rowKey="_id"
                        loading={queryPosts?.isLoading ?? true}
                        columns={columns}
                        dataSource={queryPosts?.data?.data.posts ?? []}
                        pagination={false}
                    />
                    <Pagination
                        align="end"
                        defaultCurrent={1}
                        total={queryPosts?.data?.data.pagination.totalRecord ?? 0}
                        onChange={(page, pageSize) => {
                            navigate(`/posts?page=${page}&limit=${pageSize}`);
                        }}
                    />
                </Flex>
            </Card>
            <Modal
                title="Edit Post"
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
                    <Form.Item<PostType>
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<PostType>
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item<PostType>
                        label="Images"
                        name="images"
                    >
                        <Input.TextArea rows={4} placeholder="Enter image URLs separated by comma" />
                    </Form.Item>
                    <Form.Item<PostType>
                        label="Restaurant ID"
                        name="restaurant_id"
                        rules={[{ required: true, message: 'Please input the restaurant ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<PostType>
                        label="Active"
                        name="is_active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add Post"
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
                    initialValues={{}}
                    onFinish={onFinishAdd}
                    autoComplete="off"
                >
                    <Form.Item<Omit<PostType, '_id'>>
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<PostType, '_id'>>
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item<Omit<PostType, '_id'>>
                        label="Images"
                        name="images"
                    >
                        <Input.TextArea rows={4} placeholder="Enter image URLs separated by comma" />
                    </Form.Item>
                    <Form.Item<Omit<PostType, '_id'>>
                        label="Restaurant ID"
                        name="restaurant_id"
                        rules={[{ required: true, message: 'Please input the restaurant ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<PostType, '_id'>>
                        label="Active"
                        name="is_active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
