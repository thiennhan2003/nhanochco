import { Form, Input, InputNumber, Rate, Select, Switch } from "antd"
import type { RestaurantFormProps } from "../types/restaurant.types"

export const RestaurantForm = ({
  form,
  onFinish,
  isLoading,
  categories,
  owners,
  categoriesLoading,
  ownersLoading,
}: RestaurantFormProps) => {
  // Lấy toàn bộ danh mục từ categories
  const getCategoryOptions = () => {
    if (categoriesLoading)
      return [
        <Select.Option key="" value="">
          Đang tải danh mục...
        </Select.Option>,
      ]
    if (!categories?.length)
      return [
        <Select.Option key="" value="">
          Không có danh mục
        </Select.Option>,
      ]

    return categories.map((category) => (
      <Select.Option key={category._id} value={category._id}>
        {category.category_name}
      </Select.Option>
    ))
  }

  // Render owner options
  const renderOwnerOptions = () => {
    if (ownersLoading) return <Select.Option value="">Đang tải chủ sở hữu...</Select.Option>
    if (!owners?.length) return <Select.Option value="">Không có chủ sở hữu</Select.Option>

    return owners.map((owner) => (
      <Select.Option key={owner._id} value={owner._id}>
        {owner.username} ({owner.fullname})
      </Select.Option>
    ))
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      style={{ maxWidth: 650 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
        <Select loading={categoriesLoading}>{getCategoryOptions()}</Select>
      </Form.Item>
      <Form.Item label="Chủ sở hữu" name="owner_id" rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}>
        <Select loading={ownersLoading}>{renderOwnerOptions()}</Select>
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
  )
}
