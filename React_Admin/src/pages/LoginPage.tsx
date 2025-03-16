import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import axios from 'axios'
import { env } from '../constants/getEnvs';
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
       if (responseLogin.status === 200) {
         const { accessToken, refreshToken } = responseLogin.data; // Adjusted to match the response structure
         setTokens({ accessToken, refreshToken });
         console.log('Access Token:', accessToken);

         try {
           const responseProfile = await axios.get(
             `${env.API_URL}/v1/auth/get-profile`, {
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${accessToken}`,
               },
             });
           console.log('<<=== 🚀 responseProfile ===>>', responseProfile);

           if (responseProfile.status === 200) {
             const userProfile = responseProfile.data; // Adjusted to match the response structure
             console.log('User Role:', userProfile.role);

             if (userProfile.role !== 'admin') {
               messageApi.open({
                 type: 'error',
                 content: 'Access denied. Admin role required.',
               });
               return;
             }

             setUser(userProfile);
             navigate('/');
           } else {
             console.error('Failed to fetch profile:', responseProfile);
             messageApi.open({
               type: 'error',
               content: 'Failed to fetch user profile.',
             });
           }
         } catch (profileError) {
           console.error('Error fetching profile:', profileError);
           messageApi.open({
             type: 'error',
             content: 'Error fetching user profile.',
           });
         }
       } else {
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
        email: 'mikocutecute@gmail.com',
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