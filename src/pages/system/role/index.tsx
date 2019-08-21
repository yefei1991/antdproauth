import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin,Modal, message,TreeSelect } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { StateType, ParamType,Model as Role } from './model';
import { connect } from 'dva';
import {ConnectProps} from '@/models/connect'
import {ResponseType} from '@/services/common'

interface Props extends FormComponentProps,ConnectProps {
  roleManage: StateType;
  loading: boolean;
}

interface State{
  modelVisible:boolean
  roleResourceVisible:boolean
  currentRoleId:number
}
@connect(
  ({
    roleManage,
    loading,
  }: {
    roleManage: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    roleManage,
    loading: loading.models.roleManage,
  }),
)
class Manage extends Component<Props, State> {
  
  state={
    modelVisible:false,
    roleResourceVisible:false,
    currentRoleId:0
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
      type: 'roleManage/fetchList',
      payload: {
        current: 1,
        pageSize: 10,
      }
    });
  }

  handleReset = () => {
    const { dispatch,form,roleManage:{pagination} } = this.props;
    const payload={current: 1,pageSize: pagination.pageSize,}
    form.resetFields(this.searchKeys)
    dispatch({
      type: 'roleManage/fetchList',
      payload
    });
  };
  handleAdd = () => {
    this.setState({modelVisible:true})
  };
  handleSearch = () => {
    const { dispatch,form,roleManage } = this.props;
    let values=form.getFieldsValue(this.searchKeys)
    let pagination=roleManage.pagination
    const payload={current: 1,pageSize: pagination.pageSize,}
    for(let key in values){
      payload[key.substring(2)]=values[key]
    }
    dispatch({
      type: 'roleManage/fetchList',
      payload
    });
  };
  handleEdit=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'roleManage/fetchInfo',
      payload:{id}
    })
  }
  handleSave=()=>{
    const{form,dispatch,roleManage:{currentModel}}=this.props
    form.validateFields(this.formKeys,(err,values)=>{
      if(!err){
        if(currentModel){
          values.id=currentModel.id
        }
        dispatch({
          type: 'roleManage/saveModel',
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
          type: 'roleManage/deleteModel',
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
      type: 'roleManage/setEditModel',
    });
  }
  handleChange = (pagination: PaginationProps) => {
    const {
      dispatch,
      roleManage: { pagination: old },
    } = this.props;
    const payload: ParamType = pagination;
    if (pagination.pageSize !== old.pageSize) {
      payload.current = 1;
    }
    dispatch({
      type: 'roleManage/fetchList',
      payload,
    });
  };

  openRoleResource=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({roleResourceVisible:true,currentRoleId:id})
    dispatch({
      type: 'roleManage/roleResources',
      payload:{roleId:id}
    })
  }

  renderRoleResource=()=>{
    const{roleManage:{roleResources,resourceChecked},dispatch}=this.props
    if(roleResources){
      console.info(resourceChecked)
      const tProps = {
        treeData:roleResources,
        value: resourceChecked,
        treeCheckable: true,
        searchPlaceholder: '请选择资源',
        treeDefaultExpandAll:true,
        style: {
          width: 300,
        },
      };
      return (
        <TreeSelect {...tProps} onChange={(values)=>{
          dispatch({
            type:'roleManage/setResourceChecked',
            payload:values
          })
        }}/>
        )
    }
    return null
  }
  saveRoleResource=()=>{
    const{dispatch}=this.props
    const{roleManage:{resourceChecked}}=this.props
    dispatch({
      type:'roleManage/allocateResource',
      payload:{userId:this.state.currentRoleId,resourceIdList:resourceChecked!.join(',')}
    }).then(()=>{
      this.setState({roleResourceVisible:false})
      this.handleSearch()
    })
  }
  closeRoleResource=()=>{
    const {
      dispatch,
    } = this.props;
    this.setState({roleResourceVisible:false})
    dispatch({
      type: 'roleManage/setRoleResources',
    });
  }
  columns = [
    {
      title: '角色code',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roledesc',
      key: 'roledesc',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: Role) => (
        <span>
          <a href="javascript:;" onClick={()=>{this.handleEdit(record.id)}}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={()=>{this.openRoleResource(record.id)}}>分配资源</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={()=>{this.handleDelete(record.id)}}>删除</a>
        </span>
      ),
    },
  ];

  render() {
    const {
      roleManage,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const currentModel=roleManage.currentModel
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
            dataSource={roleManage.list}
            pagination={roleManage.pagination}
            onChange={this.handleChange}
          />
          <Modal
            title={currentModel?'角色编辑':'角色新增'}
            visible={this.state.modelVisible}
            onOk={this.handleSave}
            onCancel={this.handleClose}
            destroyOnClose
          >
            <Spin spinning={loading}>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Form.Item label="角色code">
                  {getFieldDecorator('name', {
                    initialValue:currentModel?currentModel.name:null,
                    rules: [{ required: true, message: '请输入角色code!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="角色">
                  {getFieldDecorator('roledesc', {
                    initialValue:currentModel?currentModel.roledesc:null,
                    rules: [{ required: true, message: '请输入角色!' }],
                  })(<Input />)}
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
          <Modal
            title='资源分配'
            visible={this.state.roleResourceVisible}
            onOk={this.saveRoleResource}
            onCancel={this.closeRoleResource}
            destroyOnClose
          >
            <Spin spinning={loading}>
              {this.renderRoleResource()}
            </Spin>
          </Modal>
        </Card>
      </Spin>
    );
  }
}

export default Form.create<Props>()(Manage);
