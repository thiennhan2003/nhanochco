"use client"

import { Button, Card, Form, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"
import { RestaurantTable } from "../components/restaurant-table"
import { EditRestaurantModal } from "../components/edit-restaurant-modal"
import { AddRestaurantModal } from "../components/add-restaurant-modal"
import { useRestaurantQueries } from "../hooks/use-restaurant-queries"
import type { RestaurantFormData } from "../types/restaurant.types"

export default function RestaurantsPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("")

  // Form instances
  const [formEdit] = Form.useForm<RestaurantFormData>()
  const [formAdd] = Form.useForm<Omit<RestaurantFormData, "id">>()

  // Initialize form with default values
  formAdd.setFieldsValue({
    is_active: true,
    average_rating: 4.5,
    avatar_url: "https://via.placeholder.com/150",
  })

  // Get all queries and mutations
  const {
    queryRestaurants,
    queryOwners,
    queryCategories,
    queryRestaurant,
    mutationDelete,
    mutationUpdate,
    mutationToggleActive,
    mutationAdd,
  } = useRestaurantQueries(page, limit, selectedId, isModalEditOpen)

  // Handle edit restaurant
  const handleEditRestaurant = (id: string) => {
    setSelectedId(id)
    setIsModalEditOpen(true)
  }

  // Handle delete restaurant
  const handleDeleteRestaurant = async (id: string) => {
    try {
      await mutationDelete.mutateAsync(id)
      messageApi.open({ type: "success", content: "Xóa nhà hàng thành công!" })
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: `Lỗi khi xóa nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await mutationToggleActive.mutateAsync({ id, is_active: isActive })
      messageApi.open({ type: "success", content: "Cập nhật trạng thái nhà hàng thành công!" })
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: `Lỗi khi cập nhật trạng thái: ${error.response?.data || "Lỗi không xác định"}`,
      })
    }
  }

  // Handle update restaurant
  const handleUpdateRestaurant = async (values: RestaurantFormData) => {
    try {
      await mutationUpdate.mutateAsync({ id: selectedId, ...values, avatar_url: values.avatar_url || "" })
      messageApi.open({ type: "success", content: "Cập nhật nhà hàng thành công!" })
      setIsModalEditOpen(false)
      formEdit.resetFields()
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: `Lỗi khi cập nhật nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    }
  }

  // Handle add restaurant
  const handleAddRestaurant = async (values: Omit<RestaurantFormData, "id">) => {
    try {
      await mutationAdd.mutateAsync({ ...values, avatar_url: values.avatar_url || "" })
      messageApi.open({ type: "success", content: "Thêm nhà hàng thành công!" })
      setIsModalAddOpen(false)
      formAdd.resetFields()
      // Reset form with default values
      formAdd.setFieldsValue({
        is_active: true,
        average_rating: 4.5,
        avatar_url: "https://via.placeholder.com/150",
      })
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: `Lỗi khi thêm nhà hàng: ${error.response?.data || "Lỗi không xác định"}`,
      })
    }
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
        <RestaurantTable
          restaurants={queryRestaurants.data}
          isLoading={queryRestaurants.isLoading}
          error={queryRestaurants.error as Error}
          onEdit={handleEditRestaurant}
          onDelete={handleDeleteRestaurant}
          onToggleActive={handleToggleActive}
        />
      </Card>

      {/* Edit Restaurant Modal */}
      <EditRestaurantModal
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onSubmit={handleUpdateRestaurant}
        restaurantQuery={queryRestaurant}
        categoriesQuery={queryCategories}
        ownersQuery={queryOwners}
        form={formEdit}
      />

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isModalAddOpen}
        onClose={() => setIsModalAddOpen(false)}
        onSubmit={handleAddRestaurant}
        categoriesQuery={queryCategories}
        ownersQuery={queryOwners}
        form={formAdd}
      />
    </>
  )
}
