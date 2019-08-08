import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table,Tag,Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.less';
import {User,StateType} from './model'
import { connect } from 'dva';
import { Dispatch } from 'redux';

interface UserManageProps extends FormComponentProps {
    userManage:StateType
    loading:boolean
    dispatch: Dispatch<any>;
}

interface UserManageState {
    aa?: string
    bb?: string
    cc?: string
    dd?: string
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

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'userManage/fetch',
          payload: {
            current: 1,
          },
        });
      }

    handleSubmit = (e: React.FormEvent) => {
        const { getFieldsValue } = this.props.form
        e.preventDefault()
        console.info(getFieldsValue())
    }
    handleReset = () => {
        alert('reset')
    }
    handleAdd = () => {
        alert('add')
    }

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
            render: (text:string, record:User) => (
                <span>
                    <a href="javascript:;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">删除</a>
                </span>
            ),
        },
    ];

    render() {
        const { userManage,loading,form:{getFieldDecorator} } = this.props;
        return (
            <Card bordered={false}>
                <Form className={styles.tableListForm} layout="inline" onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label='名称'>
                                {getFieldDecorator('s_name')(
                                    <Input />,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">
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
                    <Button type="primary" icon="plus" onClick={this.handleAdd}>新建</Button>
                </div>
                <Table columns={this.columns} dataSource={userManage.list} pagination={userManage.pagination} />
            </Card>
        )
    }
}

export default Form.create<UserManageProps>()(UserManage);