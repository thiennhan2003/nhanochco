import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import axios from 'axios'
import { env } from '../constanst/getEnvs';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router';



type TFormData = {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
   const {setTokens, setUser} = useAuthStore();
   const [messageApi, contextHolder] = message.useMessage();
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

  const onFinish = async(values: TFormData) => {
    console.log('Received values of form: ', values);
    // TODO: Add your own logic to handle form submission here.
    try {
      setIsLoading(true);
      const responseLogin = await axios.post(
        `${env.API_URL}/v1/auth/login`,
         { email: values.email, password: values.password },
       );
       console.log('<<=== 🚀 responseLogin ===>>',responseLogin);
       if(responseLogin.status === 200){
         // 1. luu tokens
         setTokens(responseLogin.data.data)
         // 2. Lấy thông tin Profile của user vừa login thành công
         const responseProfile = await axios.get(
          `${env.API_URL}/v1/auth/get-profile`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${responseLogin.data.data.accessToken}`,
            },

          });
         
         //3. Lưu thông tin profile vào local Storage
         if(responseProfile.status === 200){
            setUser(responseProfile.data.data);
            //ToDO: navigate to dashboard
          }
   
         //4. Chuyển hướng đến trang dashboard
          navigate('/')

       }else{
        messageApi.open({
          type: 'error',
          content: 'Username or password invalid',
        });
       }
    } catch (error) {
      console.log('<<=== 🚀 error ===>>',error);
      messageApi.open({
        type: 'error',
        content: 'Username or password invalid',
      });
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <Flex className='h-screen' justify='center' align='center' >
      {contextHolder}   
        <Form
      name="login"
      initialValues={{ 
        remember: true,
        email: 'admin@gmail.com',
        password: '123456789'
       }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="">Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button disabled={isLoading} loading={isLoading} block type="primary" htmlType="submit">
          {isLoading ? 'Singing...' : 'Log in'}
        </Button>
      </Form.Item>
    </Form>
    </Flex>
  );
};

export default LoginPage;