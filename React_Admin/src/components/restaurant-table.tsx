"use client"

import { Avatar, Button, Popconfirm, Rate, Space, Spin, Switch, Table } from "antd"
import type { TableProps } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import type { RestaurantTableProps, RestaurantType } from "../types/restaurant.types";

export const RestaurantTable = ({
  restaurants,
  isLoading,
  error,
  onEdit,
  onDelete,
  onToggleActive,
}: RestaurantTableProps) => {
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
      render: (rating) => <Rate disabled value={rating || 0} allowHalf />,
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
        <Switch checked={record.is_active} onChange={(checked) => onToggleActive(record._id, checked)} />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record._id)} icon={<EditOutlined />} />
          <Popconfirm
            title="Xóa nhà hàng"
            description="Bạn có chắc muốn xóa nhà hàng này không?"
            onConfirm={() => onDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="dashed" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải danh sách nhà hàng...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        Lỗi khi tải nhà hàng: {error.message || "Lỗi không xác định"}. Vui lòng thử lại sau.
      </div>
    )
  }

  return <Table rowKey="_id" columns={columns} dataSource={restaurants || []} pagination={{ pageSize: 10 }} />
}
