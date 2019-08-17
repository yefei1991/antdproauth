import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin,Modal, message,Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { User, StateType, ParamType } from './model';
import { connect } from 'dva';
import {ConnectProps} from '@/models/connect'
import {ResponseType} from '@/services/common'

interface UserManageProps extends FormComponentProps,ConnectProps {
  userManage: StateType;
  loading: boolean;
}

interface UserManageState{
  modelVisible:boolean
  userRoleVisible:boolean
  currentId?:number
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
    modelVisible:false,
    userRoleVisible:false,
    currentId:undefined
  }

  searchKeys:string[]=[]
  formKeys:string[]=[]
  componentDidMount() {
    const { dispatch,form} = this.props;
    let values=form.getFieldsValue()
    Object.keys(values).forEach(e=>{
      if(e.indexOf("s_")!=-1){
        this.searchKeys.push(e)
      }else{
        this.formKeys.push(e)
      }
    })
    dispatch({
      type: 'userManage/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      }
    });
  }

  handleReset = () => {
    const { dispatch,form,userManage:{pagination} } = this.props;
    const payload={current: 1,pageSize: pagination.pageSize,}
    form.resetFields(this.searchKeys)
    dispatch({
      type: 'userManage/fetch',
      payload
    });
  };
  handleAdd = () => {
    this.setState({modelVisible:true})
  };
  handleSearch = () => {
    const { dispatch,form,userManage } = this.props;
    let values=form.getFieldsValue(this.searchKeys)
    let pagination=userManage.pagination
    const payload={current: 1,pageSize: pagination.pageSize,}
    for(let key in values){
      payload[key.substring(2)]=values[key]
    }
    dispatch({
      type: 'userManage/fetch',
      payload
    });
  };
  handleEdit=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'userManage/fetchUserInfo',
      payload:{id}
    })
  }
  openUserRole=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({userRoleVisible:true,currentId:id})
    dispatch({
      type: 'userManage/userRoles',
      payload:{userId:id}
    })
  }
  handleSave=()=>{
    const{form,dispatch,userManage:{currentUser}}=this.props
    form.validateFields(this.formKeys,(err,values)=>{
      if(!err){
        if(currentUser){
          values.id=currentUser.id
        }
        dispatch({
          type: 'userManage/saveUser',
          payload:values,
        }).then((response:ResponseType)=>{
          if(response.code===200){
            this.setState({modelVisible:false})
            this.handleSearch()
          }else{
            message.error(response.message)
          }
        })
      }
    })
  }
  handleDelete=(id:number)=>{
    const {dispatch} = this.props
    Modal.confirm({
      title: '删除记录',
      content: '确定删除该记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'userManage/deleteUser',
          payload:{id}
        }).then((response:ResponseType)=>{
          if(response.code===200){
            this.handleSearch()
          }
        })
      },
    });
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
  renderUserRoles=()=>{
    const{userManage:{userRoles,roleChecked},dispatch}=this.props
    if(userRoles){
      return (
        <Checkbox.Group style={{ width: '100%' }} value={roleChecked} onChange={(values)=>{
          dispatch({
            type:'userManage/setRoleChecked',
            payload:values
          })
        }}>
          <Row>
            {userRoles.map(e=>(
              <Col span={6}>
                <Checkbox value={e.value}>{e.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
        )
    }
    return null
  }
  saveUserRole=()=>{
    const{dispatch}=this.props
    const{userManage:{roleChecked}}=this.props
    dispatch({
      type:'userManage/allocateRole',
      payload:{userId:this.state.currentId,roleIdList:roleChecked!.join(',')}
    }).then(()=>{
      this.setState({userRoleVisible:false})
      this.handleSearch()
    })
  }
  closeUserRole=()=>{
    const {
      dispatch,
    } = this.props;
    this.setState({userRoleVisible:false})
    dispatch({
      type: 'userManage/setUserRoles',
    });
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
      render: (text: string, record: User) => (
        <span>
          <a href="javascript:;" onClick={()=>{this.handleEdit(record.id)}}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={()=>{this.openUserRole(record.id)}}>分配角色</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={()=>{this.handleDelete(record.id)}}>删除</a>
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
          <Form className={styles.tableListForm} layout="inline">
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
            destroyOnClose
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
          <Modal
            title='角色分配'
            visible={this.state.userRoleVisible}
            onOk={this.saveUserRole}
            onCancel={this.closeUserRole}
            destroyOnClose
          >
            <Spin spinning={loading}>
              {this.renderUserRoles()}
            </Spin>
          </Modal>
        </Card>
      </Spin>
    );
  }
}

export default Form.create<UserManageProps>()(UserManage);
