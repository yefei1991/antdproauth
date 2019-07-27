import React,{Component} from 'react'

import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface LoginProps extends FormComponentProps{
}
class Login extends Component<LoginProps,any>{

  handleSubmit = (e:React.FormEvent )=> {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='请输入用户名!'
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder='请输入密码!'
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    )
  };
}

export default Form.create()(Login);