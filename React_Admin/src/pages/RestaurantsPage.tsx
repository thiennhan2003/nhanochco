"use client"

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Select,
  Switch,
  Rate,
  InputNumber,
  Spin,
} from "antd"
import type { TableProps, FormProps } from "antd"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClientPublic } from "../libs/axiosClient"
import { useSearchParams } from "react-router"
import { useEffect, useState } from "react"
import TextArea from "antd/es/input/TextArea"
import { AxiosError } from "axios"

interface CategoryType {
  _id: string
  category_name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface OwnerType {
  _id: string
  username: string
  fullname: string
  email: string
  avatar: string
  active: boolean
  role: string
  createdAt: string
  updatedAt: string
}

interface CommentType {
  _id: string
  user_id: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
}

interface RestaurantType {
  _id: string
  owner_id: OwnerType
  menu_id: string[]
  name: string
  address: string
  phone: number
  description: string
  category_id: CategoryType
  average_rating: number
  image_url: string
  comments: CommentType[]
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface RestaurantFormData {
  id?: string
  name: string
  address: string
  phone: number
  description?: string
  category_id: string
  owner_id: string
  average_rating?: number
  image_url?: string
  is_active: boolean
}

interface ToggleActiveData {
  id: string
  is_active: boolean
}

export default function RestaurantsPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const [searchParams] = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const KEYs = {
    getRestaurants: () => ["restaurants", page, limit] as const,
    getRestaurant: (id: string) => ["restaurant", id] as const,
    getCategories: () => ["categories"] as const,
    getOwners: () => ["owners"] as const,
  }

  // Fetch restaurants
  const fetchRestaurants = async (): Promise<RestaurantType[]> => {
    try {
      const response = await axiosClientPublic.get(`/restaurants?page=${page}&limit=${limit}`)
      console.log("Phản hồi từ API nhà hàng:", response.data)
      return response.data.restaurants // Trả về mảng restaurants
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà hàng:", error)
      throw error
    }
  }

  const queryRestaurants = useQuery({
    queryKey: KEYs.getRestaurants(),
    queryFn: fetchRestaurants,
  })

  // Fetch categories
  const fetchCategories = async (): Promise<CategoryType[]> => {
    const response = await axiosClientPublic.get("/categoryRestaurant")
    console.log("Phản hồi từ API danh mục:", response.data)
    return response.data.data // Trả về mảng từ data
  }

  const queryCategories = useQuery({
    queryKey: KEYs.getCategories(),
    queryFn: fetchCategories,
  })

  // Fetch owners
  const fetchOwners = async (): Promise<OwnerType[]> => {
    const response = await axiosClientPublic.get("/users?role=restaurant_owner")
    console.log("Phản hồi từ API chủ sở hữu:", response.data)
    return response.data.data.users // Trả về mảng users từ data
  }

  const queryOwners = useQuery({
    queryKey: KEYs.getOwners(),
    queryFn: fetchOwners,
  })

  const queryClient = useQueryClient()

  // Delete restaurant
  const deleteRestaurant = async (id: string): Promise<void> => {
    await axiosClientPublic.delete(`/restaurants/${id}`)
  }

  const mutationDelete = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      messageApi.open({ type: "success", content: "Xóa nhà hàng thành công!" })
    },
    onError: (error: AxiosError) => {
      messageApi.open({
        type: "error",
        content: `Lỗi khi xóa nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    },
  })

  // Update restaurant
  const updateRestaurant = async (formData: RestaurantFormData): Promise<RestaurantType> => {
    const { id, ...payload } = formData
    const response = await axiosClientPublic.put(`/restaurants/${id}`, {
      ...payload,
      image_url: payload.image_url || "https://via.placeholder.com/150",
    })
    return response.data
  }

  const mutationUpdate = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurant(selectedId) })
      messageApi.open({ type: "success", content: "Cập nhật nhà hàng thành công!" })
      setIsModalEditOpen(false)
      formEdit.resetFields()
    },
    onError: (error: AxiosError) => {
      messageApi.open({
        type: "error",
        content: `Lỗi khi cập nhật nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    },
  })

  // Toggle active status
  const toggleRestaurantActive = async (data: ToggleActiveData): Promise<void> => {
    const { id, is_active } = data
    await axiosClientPublic.patch(`/restaurants/${id}/toggle-active`, { is_active })
  }

  const mutationToggleActive = useMutation({
    mutationFn: toggleRestaurantActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      messageApi.open({ type: "success", content: "Cập nhật trạng thái nhà hàng thành công!" })
    },
    onError: (error: AxiosError) => {
      messageApi.open({
        type: "error",
        content: `Lỗi khi cập nhật trạng thái: ${error.response?.data || "Lỗi không xác định"}`,
      })
    },
  })

  // Add restaurant
  const addRestaurant = async (formData: Omit<RestaurantFormData, "id">): Promise<RestaurantType> => {
    const response = await axiosClientPublic.post("/restaurants", {
      ...formData,
      image_url: formData.image_url || "https://via.placeholder.com/150",
    })
    return response.data
  }

  const mutationAdd = useMutation({
    mutationFn: addRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      messageApi.open({ type: "success", content: "Thêm nhà hàng thành công!" })
      setIsModalAddOpen(false)
      formAdd.resetFields()
    },
    onError: (error: AxiosError) => {
      messageApi.open({
        type: "error",
        content: `Lỗi khi thêm nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    },
  })

  // Form instances
  const [formEdit] = Form.useForm<RestaurantFormData>()
  const [formAdd] = Form.useForm<Omit<RestaurantFormData, "id">>()

  // Fetch single restaurant for editing
  const fetchRestaurant = async (): Promise<RestaurantType> => {
    const response = await axiosClientPublic.get(`/restaurants/${selectedId}`)
    return response.data
  }

  const queryRestaurant = useQuery({
    queryKey: KEYs.getRestaurant(selectedId),
    queryFn: fetchRestaurant,
    enabled: selectedId !== "" && isModalEditOpen,
  })

  useEffect(() => {
    if (queryRestaurant.isSuccess && queryRestaurant.data) {
      const restaurantData = queryRestaurant.data
      formEdit.setFieldsValue({
        name: restaurantData.name,
        address: restaurantData.address,
        phone: restaurantData.phone,
        description: restaurantData.description,
        category_id: restaurantData.category_id?._id,
        owner_id: restaurantData.owner_id?._id,
        average_rating: restaurantData.average_rating,
        image_url: restaurantData.image_url,
        is_active: restaurantData.is_active,
      })
    }
  }, [selectedId, formEdit, queryRestaurant.data, queryRestaurant.isSuccess])

  const onFinishEdit: FormProps<RestaurantFormData>["onFinish"] = async (values) => {
    await mutationUpdate.mutateAsync({ id: selectedId, ...values })
  }

  const onFinishAdd: FormProps<Omit<RestaurantFormData, "id">>["onFinish"] = async (values) => {
    await mutationAdd.mutateAsync(values)
  }

  // Table columns
  const columns: TableProps<RestaurantType>["columns"] = [
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => <Avatar src={text || "https://via.placeholder.com/150"} shape="square" size={64} />,
    },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Danh mục",
      dataIndex: ["category_id", "category_name"],
      key: "category",
      render: (text, record) => record.category_id?.category_name || "N/A",
    },
    {
      title: "Chủ sở hữu",
      key: "owner",
      render: (_, record) => record.owner_id?.username || "N/A",
    },
    {
      title: "Đánh giá",
      dataIndex: "average_rating",
      key: "average_rating",
      render: (rating) => <Rate disabled defaultValue={rating || 0} allowHalf />,
    },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Hoạt động",
      dataIndex: "is_active",
      key: "is_active",
      render: (text, record) => (
        <Switch
          checked={record.is_active}
          onChange={(checked) => mutationToggleActive.mutate({ id: record._id, is_active: checked })}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedId(record._id)
              setIsModalEditOpen(true)
            }}
            icon={<EditOutlined />}
          />
          <Popconfirm
            title="Xóa nhà hàng"
            description="Bạn có chắc muốn xóa nhà hàng này không?"
            onConfirm={() => mutationDelete.mutate(record._id)}
            okButtonProps={{ loading: mutationDelete.isPending }}
            okText="Có"
            cancelText="Không"
          >
            <Button type="dashed" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Render dropdown options
  const renderCategoryOptions = () => {
    if (queryCategories.isLoading) return <Select.Option value="">Đang tải danh mục...</Select.Option>
    if (queryCategories.isError) return <Select.Option value="">Lỗi tải danh mục</Select.Option>
    if (!queryCategories.data?.length) return <Select.Option value="">Không có danh mục</Select.Option>
    return queryCategories.data.map((category: CategoryType) => (
      <Select.Option key={category._id} value={category._id}>
        {category.category_name}
      </Select.Option>
    ))
  }

  const renderOwnerOptions = () => {
    if (queryOwners.isLoading) return <Select.Option value="">Đang tải chủ sở hữu...</Select.Option>
    if (queryOwners.isError) return <Select.Option value="">Lỗi tải chủ sở hữu</Select.Option>
    if (!queryOwners.data?.length) return <Select.Option value="">Không có chủ sở hữu</Select.Option>
    return queryOwners.data.map((owner: OwnerType) => (
      <Select.Option key={owner._id} value={owner._id}>
        {owner.username} ({owner.fullname})
      </Select.Option>
    ))
  }

  return (
    <>
      {contextHolder}
      <title>Quản lý nhà hàng</title>

      <Card
        variant="borderless"
        title="Danh sách nhà hàng"
        extra={
          <Button onClick={() => setIsModalAddOpen(true)} icon={<PlusOutlined />} type="primary">
            Thêm mới
          </Button>
        }
      >
        {queryRestaurants.isLoading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải danh sách nhà hàng...</div>
          </div>
        ) : queryRestaurants.isError ? (
          <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
            Lỗi khi tải nhà hàng: {queryRestaurants.error?.message || "Lỗi không xác định"}. Vui lòng thử lại sau.
          </div>
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={queryRestaurants.data || []}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Edit Restaurant Modal */}
      <Modal
        title="Chỉnh sửa nhà hàng"
        centered
        open={isModalEditOpen}
        onOk={() => formEdit.submit()}
        onCancel={() => setIsModalEditOpen(false)}
        width={700}
      >
        <Form
          name="formEdit"
          form={formEdit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 650 }}
          onFinish={onFinishEdit}
          autoComplete="off"
        >
          <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
            <Select loading={queryCategories.isLoading}>{renderCategoryOptions()}</Select>
          </Form.Item>
          <Form.Item label="Chủ sở hữu" name="owner_id" rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}>
            <Select loading={queryOwners.isLoading}>{renderOwnerOptions()}</Select>
          </Form.Item>
          <Form.Item label="Đánh giá" name="average_rating">
            <Rate allowHalf />
          </Form.Item>
          <Form.Item label="URL hình ảnh" name="image_url">
            <Input />
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Restaurant Modal */}
      <Modal
        title="Thêm nhà hàng"
        centered
        open={isModalAddOpen}
        onOk={() => formAdd.submit()}
        onCancel={() => setIsModalAddOpen(false)}
        width={700}
      >
        <Form
          name="formAdd"
          form={formAdd}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 650 }}
          initialValues={{ is_active: true }}
          onFinish={onFinishAdd}
          autoComplete="off"
        >
          <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
            <Select loading={queryCategories.isLoading}>{renderCategoryOptions()}</Select>
          </Form.Item>
          <Form.Item label="Chủ sở hữu" name="owner_id" rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}>
            <Select loading={queryOwners.isLoading}>{renderOwnerOptions()}</Select>
          </Form.Item>
          <Form.Item label="Đánh giá" name="average_rating" initialValue={4.5}>
            <Rate allowHalf />
          </Form.Item>
          <Form.Item label="URL hình ảnh" name="image_url" initialValue="https://via.placeholder.com/150">
            <Input />
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}