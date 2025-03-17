import { DownOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router'; // Import useNavigate

export default function UserInfo() {
    const { user, clearTokens, setUser } = useAuthStore();
    console.log('Current user:', user); // Log trạng thái user để kiểm tra
    const navigate = useNavigate(); // Hook để điều hướng
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: 'My Account',
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: 'Profile',
          extra: '⌘P',
        },
        {
          key: '3',
          label: 'Billing',
          extra: '⌘B',
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <SettingOutlined />,
          extra: '⌘S',
        },
      ];

      const onClick: MenuProps['onClick'] = ({ key }) => {
           if (key === 'logout') {
               console.log('Logging out...'); // Thêm log để kiểm tra
               setUser(null); // Đặt user thành null
               clearTokens(); // Xóa token
               console.log('User logged out successfully'); // Log sau khi logout
               navigate('/login'); // Điều hướng về trang đăng nhập
           }
      };
  return (
    <Dropdown menu={{ items, onClick  }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
      <Avatar icon={<UserOutlined />} /> {user?.first_name}  {user?.last_name}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
  )
}