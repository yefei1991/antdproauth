import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin,Modal, message,Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { StateType, ParamType,Model as resource } from './model';
import { connect } from 'dva';
import {ConnectProps} from '@/models/connect'
import {ResponseType,Dictionary} from '@/services/common'

interface Props extends FormComponentProps,ConnectProps {
  resourceManage: StateType;
  loading: boolean;
}
const {Option}=Select

interface State{
  modelVisible:boolean
}
@connect(
  ({
    resourceManage,
    loading,
  }: {
    resourceManage: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    resourceManage,
    loading: loading.models.resourceManage,
  }),
)
class Manage extends Component<Props, State> {
  
  state={
    modelVisible:false,
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
      type: 'resourceManage/fetchList',
      payload: {
        current: 1,
        pageSize: 10,
      }
    });
  }

  handleReset = () => {
    const { dispatch,form,resourceManage:{pagination} } = this.props;
    const payload={current: 1,pageSize: pagination.pageSize,}
    form.resetFields(this.searchKeys)
    dispatch({
      type: 'resourceManage/fetchList',
      payload
    });
  };
  handleAdd = () => {
    const { dispatch } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'resourceManage/fetchDictionary',
    })
  };
  handleSearch = () => {
    const { dispatch,form,resourceManage } = this.props;
    let values=form.getFieldsValue(this.searchKeys)
    let pagination=resourceManage.pagination
    const payload={current: 1,pageSize: pagination.pageSize,}
    for(let key in values){
      payload[key.substring(2)]=values[key]
    }
    dispatch({
      type: 'resourceManage/fetchList',
      payload
    });
  };
  handleEdit=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'resourceManage/fetchDictionary',
    })
    dispatch({
      type: 'resourceManage/fetchInfo',
      payload:{id}
    })
  }
  handleSave=()=>{
    const{form,dispatch,resourceManage:{currentModel}}=this.props
    form.validateFields(this.formKeys,(err,values)=>{
      if(!err){
        if(currentModel){
          values.id=currentModel.id
        }
        dispatch({
          type: 'resourceManage/saveModel',
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
          type: 'resourceManage/deleteModel',
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
      type: 'resourceManage/setEditModel',
    });
  }
  handleChange = (pagination: PaginationProps) => {
    const {
      dispatch,
      resourceManage: { pagination: old },
    } = this.props;
    const payload: ParamType = pagination;
    if (pagination.pageSize !== old.pageSize) {
      payload.current = 1;
    }
    dispatch({
      type: 'resourceManage/fetchList',
      payload,
    });
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'resurl',
      key: 'resurl',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: resource) => (
        <span>
          <a href="javascript:;" onClick={()=>{this.handleEdit(record.id)}}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={()=>{this.handleDelete(record.id)}}>删除</a>
        </span>
      ),
    },
  ];

  render() {
    const {
      resourceManage,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const currentModel=resourceManage.currentModel
    const dictionarys=resourceManage.dictionarys
    let types:Dictionary[]=[]
    let directorys:Dictionary[]=[]
    if(dictionarys){
      types=dictionarys.types
      directorys=dictionarys.dictionarys
    }
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
            dataSource={resourceManage.list}
            pagination={resourceManage.pagination}
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
              <Form.Item label="父节点">
                  {getFieldDecorator('parentid', {
                    initialValue:currentModel?currentModel.parentid:null,
                    rules: [{ required: true, message: '请输入父节点!' }],
                  })(
                  <Select placeholder="请输入父节点">
                    {directorys.map(v=>(<Option value={v.value}>{v.label}</Option>))}
                  </Select>)}
                </Form.Item>
                <Form.Item label="名称">
                  {getFieldDecorator('name', {
                    initialValue:currentModel?currentModel.name:null,
                    rules: [{ required: true, message: '请输入名称!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="路径">
                  {getFieldDecorator('resurl', {
                    initialValue:currentModel?currentModel.resurl:null,
                    rules: [{ required: true, message: '请输入路径!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="类型">
                  {getFieldDecorator('type', {
                    initialValue:currentModel?currentModel.type:null,
                    rules: [{ required: true, message: '请输入类型!' }],
                  })(<Select placeholder="请输入类型">
                  {types.map(v=>(<Option value={v.value}>{v.label}</Option>))}
                </Select>)}
                </Form.Item>
                <Form.Item label="排序">
                  {getFieldDecorator('sort', {
                    initialValue:currentModel?currentModel.sort:null,
                    rules: [{ required: true, message: '请输入排序!' }],
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

export default Form.create<Props>()(Manage);
