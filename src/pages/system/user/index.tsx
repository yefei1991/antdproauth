import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin,Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { User, StateType, ParamType } from './model';
import { connect } from 'dva';
import { Dispatch } from 'redux';

interface UserManageProps extends FormComponentProps {
  userManage: StateType;
  loading: boolean;
  dispatch: Dispatch<any>;
}

interface UserManageState{
  modelVisible:boolean
}
@connect(
  ({
    userManage,
    loading,
  }: {
    userManage: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    userManage,
    loading: loading.models.userManage,
  }),
)
class UserManage extends Component<UserManageProps, UserManageState> {
  
  state={
    modelVisible:false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    const { getFieldsValue } = this.props.form;
    e.preventDefault();
    console.info(getFieldsValue());
  };
  handleReset = () => {
    alert('reset');
  };
  handleAdd = () => {
    this.setState({modelVisible:true})
  };
  handleSearch = () => {
    alert('search');
  };
  handleEdit=(id:number)=>{
    const {
      dispatch,
    } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'userManage/fetchUserInfo',
      payload:{id}
    });
  }
  handleSave=()=>{
    alert('save')
  }
  handleClose=()=>{
    const {
      dispatch,
    } = this.props;
    this.setState({modelVisible:false})
    dispatch({
      type: 'userManage/setCurrentUser',
    });
  }
  handleChange = (pagination: PaginationProps) => {
    const {
      dispatch,
      userManage: { pagination: old },
    } = this.props;
    const payload: ParamType = pagination;
    if (pagination.pageSize !== old.pageSize) {
      payload.current = 1;
    }
    dispatch({
      type: 'userManage/fetch',
      payload,
    });
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: User) => (
        <span>
          <a href="javascript:;" onClick={()=>{this.handleEdit(record.id)}}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;">删除</a>
        </span>
      ),
    },
  ];

  render() {
    const {
      userManage,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const currentUser=userManage.currentUser
    return (
      <Spin spinning={loading}>
        <Card bordered={false}>
          <Form className={styles.tableListForm} layout="inline" onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="名称">{getFieldDecorator('s_name')(<Input />)}</Form.Item>
              </Col>
              <Col span={6}>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Col>
            </Row>
          </Form>
          <div className={styles.tableListOperator}>
            <Button type="primary" icon="plus" onClick={this.handleAdd}>
              新建
            </Button>
          </div>
          <Table
            columns={this.columns}
            dataSource={userManage.list}
            pagination={userManage.pagination}
            onChange={this.handleChange}
          />
          <Modal
            title={currentUser?'用户编辑':'用户新增'}
            visible={this.state.modelVisible}
            onOk={this.handleSave}
            onCancel={this.handleClose}
          >
            <Spin spinning={loading}>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Form.Item label="用户名">
                  {getFieldDecorator('username', {
                    initialValue:currentUser?currentUser.username:null,
                    rules: [{ required: true, message: '请输入用户名!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    initialValue:currentUser?currentUser.name:null,
                    rules: [{ required: true, message: '请输入姓名!' }],
                  })(<Input />)}
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </Card>
      </Spin>
    );
  }
}

export default Form.create<UserManageProps>()(UserManage);
