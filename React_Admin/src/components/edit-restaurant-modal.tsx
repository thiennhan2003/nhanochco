"use client"

import { Spin } from "antd"
import { RestaurantForm } from "./restaurant-form"
import { RestaurantModal } from "./restaurant-modal"
import type { RestaurantFormData, RestaurantResponse } from "../types/restaurant.types"
import { useEffect } from "react"

interface EditRestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: RestaurantFormData) => void
  restaurantQuery: {
    data?: RestaurantResponse
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
  categoriesQuery: any
  ownersQuery: any
  form: any
}

export const EditRestaurantModal = ({
  isOpen,
  onClose,
  onSubmit,
  restaurantQuery,
  categoriesQuery,
  ownersQuery,
  form,
}: EditRestaurantModalProps) => {
  // Populate form fields when data is loaded
  useEffect(() => {
    if (restaurantQuery.data?.data) {
      const restaurantData = restaurantQuery.data.data
      form.setFieldsValue({
        name: restaurantData.name,
        address: restaurantData.address,
        phone: restaurantData.phone,
        description: restaurantData.description,
        category_id: restaurantData.category_id?._id,
        owner_id: restaurantData.owner_id?._id,
        average_rating: restaurantData.average_rating,
        avatar_url: restaurantData.avatar_url,
        is_active: restaurantData.is_active,
      })
    }
  }, [restaurantQuery.data, form])

  return (
    <RestaurantModal
      title="Chỉnh sửa nhà hàng"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        onClose()
        form.resetFields()
      }}
    >
      {restaurantQuery.isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <div>Đang tải dữ liệu nhà hàng...</div>
        </div>
      ) : restaurantQuery.isError ? (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Lỗi tải dữ liệu nhà hàng: {restaurantQuery.error?.message || "Lỗi không xác định"}
        </div>
      ) : (
        <RestaurantForm
          form={form}
          onFinish={onSubmit}
          isLoading={restaurantQuery.isLoading}
          categories={categoriesQuery.data}
          owners={ownersQuery.data}
          categoriesLoading={categoriesQuery.isLoading}
          ownersLoading={ownersQuery.isLoading}
        />
      )}
    </RestaurantModal>
  )
}
