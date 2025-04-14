import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Form, Input, message, Modal, Pagination, Popconfirm, Space, Table, Select, Switch } from "antd";
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

interface CategoryRestaurantType {
    _id: string;
    category_name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function CategoryRestaurantPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const KEYs = {
        getCategoryRestaurants: () => {
            return ['categoryRestaurants', page, limit];
        },
        getCategoryRestaurant: (id: string) => {
            return ['categoryRestaurant', id];
        }
    };

    const fetchCategoryRestaurants = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/categoryRestaurant?page=${page}&limit=${limit}`);
        return response.data;
    };

    const queryCategoryRestaurants = useQuery({
        queryKey: KEYs.getCategoryRestaurants(),
        queryFn: fetchCategoryRestaurants
    });

    const queryClient = useQueryClient();

    const deleteCategoryRestaurant = async (id: string) => {
        const response = await axiosClient.delete(`${env.API_URL}/v1/categoryRestaurant/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deleteCategoryRestaurant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryRestaurants() });
            messageApi.open({
                type: 'success',
                content: 'Category deleted successfully!',
            });
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Failed to delete category!',
            });
        }
    });

    const [formEdit] = Form.useForm();
    const [selectedId, setSelectedId] = useState<string>('');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const updateCategoryRestaurant = async (formData: CategoryRestaurantType) => {
        const response = await axiosClient.put(
            `${env.API_URL}/v1/categoryRestaurant/${formData._id}`,
            {
                category_name: formData.category_name,
                description: formData.description
            }
        );
        return response.data;
    };

    const mutationUpdate = useMutation({
        mutationFn: updateCategoryRestaurant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryRestaurants() });
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryRestaurant(selectedId) });
            messageApi.open({
                type: 'success',
                content: 'Category updated successfully!',
            });
            setIsModalEditOpen(false);
            formEdit.resetFields();
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            messageApi.open({
                type: 'error',
                content: error.response?.data?.message || 'Failed to update category!',
            });
        }
    });

    const onFinishEdit: FormProps<CategoryRestaurantType>['onFinish'] = async (values) => {
        await mutationUpdate.mutateAsync({
            ...values,
            _id: selectedId
        });
    };

    const fetchCategoryRestaurant = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/categoryRestaurant/${selectedId}`);
        return response.data;
    };

    const queryCategoryRestaurant = useQuery({
        queryKey: KEYs.getCategoryRestaurant(selectedId),
        queryFn: fetchCategoryRestaurant,
        enabled: selectedId !== '' && isModalEditOpen === true
    });

    useEffect(() => {
        if (queryCategoryRestaurant.isSuccess && queryCategoryRestaurant.data) {
            formEdit.setFieldsValue(queryCategoryRestaurant.data.data);
        }
    }, [selectedId, formEdit, queryCategoryRestaurant.data, queryCategoryRestaurant.isSuccess]);

    const columns: TableProps<CategoryRestaurantType>['columns'] = [
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
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
                        title="Delete the category"
                        description="Are you sure to delete this category?"
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

    const addCategoryRestaurant = async (formData: Omit<CategoryRestaurantType, '_id'>) => {
        const response = await axiosClient.post(`${env.API_URL}/v1/categoryRestaurant`, formData);
        return response.data;
    };

    const mutationAdd = useMutation({
        mutationFn: addCategoryRestaurant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryRestaurants() });
            messageApi.open({
                type: 'success',
                content: 'Category added successfully!',
            });
            setIsModalAddOpen(false);
            formAdd.resetFields();
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Failed to add category!',
            });
        }
    });

    const onFinishAdd: FormProps<Omit<CategoryRestaurantType, '_id'>>['onFinish'] = async (values) => {
        await mutationAdd.mutateAsync(values);
    };

    return (
        <>
            {contextHolder}
            <title>Category Restaurant Manager</title>
            <Card
                variant="borderless"
                title="Category Restaurants List"
                extra={<Button onClick={() => setIsModalAddOpen(true)} icon={<PlusOutlined />} type="primary">Add New</Button>}
            >
                <Flex vertical gap="middle">
                    <Table<CategoryRestaurantType>
                        rowKey="_id"
                        loading={queryCategoryRestaurants?.isLoading ?? true}
                        columns={columns}
                        dataSource={queryCategoryRestaurants?.data?.data.categoryRestaurants ?? []}
                        pagination={false}
                    />
                    <Pagination
                        align="end"
                        defaultCurrent={1}
                        total={queryCategoryRestaurants?.data?.data.pagination.totalRecord ?? 0}
                        onChange={(page, pageSize) => {
                            navigate(`/categoryRestaurants?page=${page}&limit=${pageSize}`);
                        }}
                    />
                </Flex>
            </Card>
            <Modal
                title="Edit Category Restaurant"
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
                    initialValues={{} }
                    onFinish={onFinishEdit}
                    autoComplete="off"
                >
                    <Form.Item<CategoryRestaurantType>
                        label="Category Name"
                        name="category_name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<CategoryRestaurantType>
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add Category Restaurant"
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
                    <Form.Item<Omit<CategoryRestaurantType, '_id'>>
                        label="Category Name"
                        name="category_name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<CategoryRestaurantType, '_id'>>
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
