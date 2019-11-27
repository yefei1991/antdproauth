import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin,Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { StateType, ParamType,Model as dictionary } from './model';
import { connect } from 'dva';
import {ConnectProps} from '@/models/connect'
import {ResponseType} from '@/services/common'

interface Props extends FormComponentProps,ConnectProps {
  dictionaryManage: StateType;
  loading: boolean;
}

interface State{
  modelVisible:boolean
}
@connect(
  ({
    dictionaryManage,
    loading,
  }: {
    dictionaryManage: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    dictionaryManage,
    loading: loading.models.dictionaryManage,
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
      type: 'dictionaryManage/fetchList',
      payload: {
        current: 1,
        pageSize: 10,
      }
    });
  }

  handleReset = () => {
    const { dispatch,form,dictionaryManage:{pagination} } = this.props;
    const payload={current: 1,pageSize: pagination.pageSize,}
    form.resetFields(this.searchKeys)
    dispatch({
      type: 'dictionaryManage/fetchList',
      payload
    });
  };
  handleAdd = () => {
    const { dispatch } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'dictionaryManage/fetchDictionary',
    })
  };
  handleSearch = () => {
    const { dispatch,form,dictionaryManage } = this.props;
    let values=form.getFieldsValue(this.searchKeys)
    let pagination=dictionaryManage.pagination
    const payload={current: 1,pageSize: pagination.pageSize,}
    for(let key in values){
      payload[key.substring(2)]=values[key]
    }
    dispatch({
      type: 'dictionaryManage/fetchList',
      payload
    });
  };
  handleEdit=(id:number)=>{
    const {
      dispatch
    } = this.props;
    this.setState({modelVisible:true})
    dispatch({
      type: 'dictionaryManage/fetchDictionary',
    })
    dispatch({
      type: 'dictionaryManage/fetchInfo',
      payload:{id}
    })
  }
  handleSave=()=>{
    const{form,dispatch,dictionaryManage:{currentModel}}=this.props
    form.validateFields(this.formKeys,(err,values)=>{
      if(!err){
        if(currentModel){
          values.id=currentModel.id
        }
        dispatch({
          type: 'dictionaryManage/saveModel',
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
          type: 'dictionaryManage/deleteModel',
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
      type: 'dictionaryManage/setEditModel',
    });
  }
  handleChange = (pagination: PaginationProps) => {
    const {
      dispatch,
      dictionaryManage: { pagination: old },
    } = this.props;
    const payload: ParamType = pagination;
    if (pagination.pageSize !== old.pageSize) {
      payload.current = 1;
    }
    dispatch({
      type: 'dictionaryManage/fetchList',
      payload,
    });
  };

  columns = [
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '选项编码',
      dataIndex: 'option',
      key: 'option',
    },
    {
      title: '选项',
      dataIndex: 'optiondesc',
      key: 'optiondesc',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: dictionary) => (
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
      dictionaryManage,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const currentModel=dictionaryManage.currentModel
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
            dataSource={dictionaryManage.list}
            pagination={dictionaryManage.pagination}
            onChange={this.handleChange}
          />
          <Modal
            title={currentModel?'字典编辑':'字典新增'}
            visible={this.state.modelVisible}
            onOk={this.handleSave}
            onCancel={this.handleClose}
            destroyOnClose
          >
            <Spin spinning={loading}>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Form.Item label="字典编码">
                  {getFieldDecorator('code', {
                    initialValue:currentModel?currentModel.code:null,
                    rules: [{ required: true, message: '请输入字典编码!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="名称">
                  {getFieldDecorator('name', {
                    initialValue:currentModel?currentModel.name:null,
                    rules: [{ required: true, message: '请输入名称!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="选项编码">
                  {getFieldDecorator('option', {
                    initialValue:currentModel?currentModel.option:null,
                    rules: [{ required: true, message: '选项编码!' }],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="选项">
                  {getFieldDecorator('optiondesc', {
                    initialValue:currentModel?currentModel.optiondesc:null,
                    rules: [{ required: true, message: '请输入选项!' }],
                  })(<Input />)}
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
