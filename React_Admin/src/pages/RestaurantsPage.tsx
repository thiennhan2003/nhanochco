"use client"

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
  Image
} from "antd"
import type { TableProps, FormProps } from "antd"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClientPublic } from "../libs/axiosClient"
import { useSearchParams } from "react-router"
import { useEffect, useState } from "react"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
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
  phone: string
  description: string
  category_id: CategoryType
  average_rating: number
  avatar_url: string
  images: string[]
  comments: CommentType[]
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface RestaurantResponse {
  statusCode: number
  message: string
  data: RestaurantType
}

interface RestaurantFormData {
  id?: string
  name: string
  address: string
  phone: string
  description?: string
  category_id: string
  owner_id: string
  average_rating?: number
  avatar_url?: string
  images?: string[]
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
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const KEYs = {
    getRestaurants: () => ["restaurants", page, limit] as const,
    getRestaurant: (id: string) => ["restaurant", id] as const,
    getOwners: () => ["owners"] as const,
    getCategories: () => ["categories"] as const,
  }

  // Fetch restaurants
  const fetchRestaurants = async (): Promise<RestaurantType[]> => {
    const response = await axiosClientPublic.get(`/restaurants?page=${page}&limit=${limit}`)
    return response.data.restaurants
  }

  const queryRestaurants = useQuery({
    queryKey: KEYs.getRestaurants(),
    queryFn: fetchRestaurants,
  })

  // Fetch owners
  const fetchOwners = async (): Promise<OwnerType[]> => {
    const response = await axiosClientPublic.get("/users?role=restaurant_owner")
    return response.data.data.users
  }

  const queryOwners = useQuery({
    queryKey: KEYs.getOwners(),
    queryFn: fetchOwners,
  })

  // Fetch all categories
  const fetchCategories = async (): Promise<CategoryType[]> => {
    const response = await axiosClientPublic.get("/categoryRestaurant") // Sửa thành /categoryRestaurant
    return response.data.data.categoryRestaurants
  }

  const queryCategories = useQuery({
    queryKey: KEYs.getCategories(),
    queryFn: fetchCategories,
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
      avatar_url: payload.avatar_url || "https://via.placeholder.com/150",
      images: payload.images || [],
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
      avatar_url: formData.avatar_url || "https://via.placeholder.com/150",
      images: formData.images || [],
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
  const fetchRestaurant = async (): Promise<RestaurantResponse> => {
    const response = await axiosClientPublic.get(`/restaurants/${selectedId}`)
    return response.data
  }

  const queryRestaurant = useQuery({
    queryKey: KEYs.getRestaurant(selectedId),
    queryFn: fetchRestaurant,
    enabled: selectedId !== "" && isModalEditOpen,
  })

  // Hàm riêng để đẩy dữ liệu lên form với log
  const populateFormFields = (restaurantResponse: RestaurantResponse) => {
    const restaurantData = restaurantResponse.data
    console.log("Đẩy dữ liệu vào formEdit:", restaurantData)
    formEdit.setFieldsValue({
      name: restaurantData.name,
      address: restaurantData.address,
      phone: restaurantData.phone,
      description: restaurantData.description,
      category_id: restaurantData.category_id?._id,
      owner_id: restaurantData.owner_id?._id,
      average_rating: restaurantData.average_rating,
      avatar_url: restaurantData.avatar_url,
      images: restaurantData.images,
      is_active: restaurantData.is_active,
    })
  }

  useEffect(() => {
    if (queryRestaurant.isSuccess && queryRestaurant.data) {
      populateFormFields(queryRestaurant.data)
    }
  }, [selectedId, formEdit, queryRestaurant.data, queryRestaurant.isSuccess])

  const onFinishEdit: FormProps<RestaurantFormData>["onFinish"] = async (values) => {
    await mutationUpdate.mutateAsync({ id: selectedId, ...values })
  }

  const onFinishAdd: FormProps<Omit<RestaurantFormData, "id">>["onFinish"] = async (values) => {
    await mutationAdd.mutateAsync(values)
  }

  // Lấy toàn bộ danh mục từ queryCategories
  const getCategoryOptions = () => {
    if (queryCategories.isLoading) return [<Select.Option key="" value="">Đang tải danh mục...</Select.Option>]
    if (queryCategories.isError) return [<Select.Option key="" value="">Lỗi tải danh mục</Select.Option>]
    if (!queryCategories.data?.length) return [<Select.Option key="" value="">Không có danh mục</Select.Option>]

    return queryCategories.data.map((category) => (
      <Select.Option key={category._id} value={category._id}>
        {category.category_name}
      </Select.Option>
    ))
  }

  // Render owner options (giữ nguyên)
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

  // Table columns
  const columns: TableProps<RestaurantType>["columns"] = [
    {
      title: "Hình ảnh đại diện",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (text: string) => <Avatar src={text || "https://via.placeholder.com/150"} shape="square" size={64} />,
    },
    {
      title: "Ảnh nhà hàng",
      dataIndex: "images",
      key: "images",
      render: (images: string[] | undefined, record: RestaurantType) => (
        <>
          <Avatar
            src={images?.[0] || "https://via.placeholder.com/150"}
            shape="square"
            size={40}
            onClick={() => setSelectedImages(images || [])}
            style={{ cursor: "pointer" }}
          />
          {images && images.length > 1 && (
            <span style={{ marginLeft: 8, color: "#666", fontSize: 12 }}>
              ({images.length} ảnh)
            </span>
          )}
        </>
      ),
    },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Danh mục",
      dataIndex: ["category_id", "category_name"],
      key: "category",
      render: (text: string, record: RestaurantType) => record.category_id?.category_name || "N/A",
    },
    {
      title: "Chủ sở hữu",
      key: "owner",
      render: (_, record: RestaurantType) => record.owner_id?.username || "N/A",
    },
    {
      title: "Đánh giá",
      dataIndex: "average_rating",
      key: "average_rating",
      render: (rating: number) => <Rate disabled value={rating || 0} allowHalf />,
    },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Hoạt động",
      dataIndex: "is_active",
      key: "is_active",
      render: (text: boolean, record: RestaurantType) => (
        <Switch
          checked={record.is_active}
          onChange={(checked) => mutationToggleActive.mutate({ id: record._id, is_active: checked })}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record: RestaurantType) => (
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

      {/* Image Modal */}
      <Modal
        title="Ảnh nhà hàng"
        open={selectedImages.length > 0}
        onCancel={() => setSelectedImages([])}
        width={800}
        footer={null}
      >
        {selectedImages.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "16px" }}>
            {selectedImages.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <Image
                  src={image}
                  width={200}
                  height={200}
                  preview={{ visible: false }}
                  style={{ borderRadius: "8px" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      {/* Edit Restaurant Modal */}
      <Modal
        title="Chỉnh sửa nhà hàng"
        centered
        open={isModalEditOpen}
        onOk={() => formEdit.submit()}
        onCancel={() => {
          setIsModalEditOpen(false)
          formEdit.resetFields()
        }}
        width={1000}
      >
        {queryRestaurant.isLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div>Đang tải dữ liệu nhà hàng...</div>
          </div>
        ) : queryRestaurant.isError ? (
          <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
            Lỗi tải dữ liệu nhà hàng: {queryRestaurant.error?.message || "Lỗi không xác định"}
          </div>
        ) : (
          <Form
            name="formEdit"
            form={formEdit}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: "100%", overflowX: "auto" }}
            onFinish={onFinishEdit}
            autoComplete="off"
          >
            <div style={{ display: "flex", gap: "24px", minWidth: "1200px" }}>
              <div style={{ flex: 1 }}>
                <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
                  <Select loading={queryCategories.isLoading}>{getCategoryOptions()}</Select>
                </Form.Item>
                <Form.Item label="Chủ sở hữu" name="owner_id" rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}>
                  <Select loading={queryOwners.isLoading}>{renderOwnerOptions()}</Select>
                </Form.Item>
                <Form.Item label="Đánh giá" name="average_rating">
                  <Rate allowHalf />
                </Form.Item>
                <Form.Item label="URL ảnh đại diện" name="avatar_url">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <Form.Item label="Ảnh nhà hàng" name="images">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Input.TextArea rows={4} placeholder="Nhập URL ảnh, mỗi URL trên một dòng" />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {formEdit.getFieldValue("images")?.split("\n").filter(Boolean).map((image: string, index: number) => (
                    <Avatar key={index} src={image} shape="square" size={64} />
                  ))}
                </div>
              </div>
            </Form.Item>
            <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Add Restaurant Modal */}
      <Modal
        title="Thêm nhà hàng"
        centered
        open={isModalAddOpen}
        onOk={() => formAdd.submit()}
        onCancel={() => {
          setIsModalAddOpen(false)
          formAdd.resetFields()
        }}
        width={1000}
      >
        <Form
          name="formAdd"
          form={formAdd}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: "100%", overflowX: "auto" }}
          initialValues={{ is_active: true }}
          onFinish={onFinishAdd}
          autoComplete="off"
        >
          <div style={{ display: "flex", gap: "24px", minWidth: "1200px" }}>
            <div style={{ flex: 1 }}>
              <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
                <Select loading={queryCategories.isLoading}>{getCategoryOptions()}</Select>
              </Form.Item>
              <Form.Item label="Chủ sở hữu" name="owner_id" rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}>
                <Select loading={queryOwners.isLoading}>{renderOwnerOptions()}</Select>
              </Form.Item>
              <Form.Item label="Đánh giá" name="average_rating" initialValue={4.5}>
                <Rate allowHalf />
              </Form.Item>
              <Form.Item label="URL ảnh đại diện" name="avatar_url" initialValue="https://via.placeholder.com/150">
                <Input />
              </Form.Item>
            </div>
          </div>
          <Form.Item label="Ảnh nhà hàng" name="images" initialValue="[]">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Input.TextArea rows={4} placeholder="Nhập URL ảnh, mỗi URL trên một dòng" />
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {formAdd.getFieldValue("images")?.split("\n").filter(Boolean).map((image: string, index: number) => (
                  <Avatar key={index} src={image} shape="square" size={64} />
                ))}
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}