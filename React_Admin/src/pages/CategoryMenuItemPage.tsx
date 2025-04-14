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

interface CategoryMenuItemType {
    _id: string;
    category_name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function CategoryMenuItemPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const KEYs = {
        getCategoryMenuItems: () => {
            return ['categoryMenuItems', page, limit];
        },
        getCategoryMenuItem: (id: string) => {
            return ['categoryMenuItem', id];
        }
    };

    const fetchCategoryMenuItems = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/categoryMenuItem?page=${page}&limit=${limit}`);
        return response.data;
    };

    const queryCategoryMenuItems = useQuery({
        queryKey: KEYs.getCategoryMenuItems(),
        queryFn: fetchCategoryMenuItems
    });

    const queryClient = useQueryClient();

    const deleteCategoryMenuItem = async (id: string) => {
        const response = await axiosClient.delete(`${env.API_URL}/v1/categoryMenuItem/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deleteCategoryMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryMenuItems() });
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

    const updateCategoryMenuItem = async (formData: CategoryMenuItemType) => {
        const response = await axiosClient.put(
            `${env.API_URL}/v1/categoryMenuItem/${formData._id}`,
            {
                category_name: formData.category_name,
                description: formData.description
            }
        );
        return response.data;
    };

    const mutationUpdate = useMutation({
        mutationFn: updateCategoryMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryMenuItems() });
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryMenuItem(selectedId) });
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

    const onFinishEdit: FormProps<CategoryMenuItemType>['onFinish'] = async (values) => {
        await mutationUpdate.mutateAsync({
            ...values,
            _id: selectedId
        });
    };

    const fetchCategoryMenuItem = async () => {
        const response = await axiosClient.get(`${env.API_URL}/v1/categoryMenuItem/${selectedId}`);
        return response.data;
    };

    const queryCategoryMenuItem = useQuery({
        queryKey: KEYs.getCategoryMenuItem(selectedId),
        queryFn: fetchCategoryMenuItem,
        enabled: selectedId !== '' && isModalEditOpen === true
    });

    useEffect(() => {
        if (queryCategoryMenuItem.isSuccess && queryCategoryMenuItem.data) {
            formEdit.setFieldsValue(queryCategoryMenuItem.data.data);
        }
    }, [selectedId, formEdit, queryCategoryMenuItem.data, queryCategoryMenuItem.isSuccess]);

    const columns: TableProps<CategoryMenuItemType>['columns'] = [
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

    const addCategoryMenuItem = async (formData: Omit<CategoryMenuItemType, '_id'>) => {
        const response = await axiosClient.post(`${env.API_URL}/v1/categoryMenuItem`, formData);
        return response.data;
    };

    const mutationAdd = useMutation({
        mutationFn: addCategoryMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYs.getCategoryMenuItems() });
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

    const onFinishAdd: FormProps<Omit<CategoryMenuItemType, '_id'>>['onFinish'] = async (values) => {
        await mutationAdd.mutateAsync(values);
    };

    return (
        <>
            {contextHolder}
            <title>Category Menu Item Manager</title>
            <Card
                variant="borderless"
                title="Category Menu Items List"
                extra={<Button onClick={() => setIsModalAddOpen(true)} icon={<PlusOutlined />} type="primary">Add New</Button>}
            >
                <Flex vertical gap="middle">
                    <Table<CategoryMenuItemType>
                        rowKey="_id"
                        loading={queryCategoryMenuItems?.isLoading ?? true}
                        columns={columns}
                        dataSource={queryCategoryMenuItems?.data?.data.categoryMenuItems ?? []}
                        pagination={false}
                    />
                    <Pagination
                        align="end"
                        defaultCurrent={1}
                        total={queryCategoryMenuItems?.data?.data.pagination.totalRecord ?? 0}
                        onChange={(page, pageSize) => {
                            navigate(`/categoryMenuItems?page=${page}&limit=${pageSize}`);
                        }}
                    />
                </Flex>
            </Card>
            <Modal
                title="Edit Category Menu Item"
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
                    <Form.Item<CategoryMenuItemType>
                        label="Category Name"
                        name="category_name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<CategoryMenuItemType>
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add Category Menu Item"
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
                    <Form.Item<Omit<CategoryMenuItemType, '_id'>>
                        label="Category Name"
                        name="category_name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Omit<CategoryMenuItemType, '_id'>>
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
