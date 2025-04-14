import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router'; // Sử dụng useNavigate thay vì Navigate
import UserInfo from '../components/UserInfo'; // Import UserInfo
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('DashBoard', '', <PieChartOutlined />),
  getItem('Restaurant', 'restaurants', <DesktopOutlined />),
  getItem('Menu Items', 'menu_items', <UserOutlined />),
  getItem('Posts', 'posts', <TeamOutlined />),
  getItem('User', 'users', <FileOutlined />),
  getItem('Category Restaurants', 'category_restaurants', <AppstoreOutlined />),
  getItem('Category Menu Items', 'category_menu_items', <AppstoreOutlined />),
];

const DefaultLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            navigate(`/${key}`); // Điều hướng đến đường dẫn tương ứng
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '16px' }}>
          <UserInfo /> {/* Thêm UserInfo vào Header */}
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb items={[
            { title: 'User' },
            { title: 'Bill' }
          ]} style={{ margin: '16px 0' }} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ProtectedRoute>
              <Outlet /> {/* Bọc Outlet bằng ProtectedRoute */}
            </ProtectedRoute>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design  Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;