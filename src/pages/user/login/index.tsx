import React, { Component } from 'react';

import { Form, Icon, Input, Button, Alert } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { StateType } from '../../../models/login';
import { Dispatch } from 'redux';

interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)
class Login extends Component<LoginProps, any> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'userLogin/login',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      submitting,
      userLogin: { status },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {status === 'error' && !submitting && this.renderMessage(this.props.userLogin.errorMessage!)}
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名!"
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
              placeholder="请输入密码!"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            loading={submitting}
            type="primary"
            htmlType="submit"
            block
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Login);
