import React, { Component } from 'react';
import { Card, Form, Button, Input, Row, Col, Table, Divider, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import styles from './index.less';
import { StateType, ParamType,Model as resource } from './model';
import { connect } from 'dva';
import {ConnectProps} from '@/models/connect'

interface Props extends FormComponentProps,ConnectProps {
  novel: StateType;
  loading: boolean;
}

interface State{
  modelVisible:boolean
}
@connect(
  ({
    novel,
    loading,
  }: {
    novel: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    novel,
    loading: loading.models.novel,
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
      type: 'novel/fetchList',
      payload: {
        current: 1,
        pageSize: 10,
      }
    });
  }

  handleReset = () => {
    const { dispatch,form,novel:{pagination} } = this.props;
    const payload={current: 1,pageSize: pagination.pageSize,}
    form.resetFields(this.searchKeys)
    dispatch({
      type: 'novel/fetchList',
      payload
    });
  };
  handleSearch = () => {
    const { dispatch,form,novel } = this.props;
    let values=form.getFieldsValue(this.searchKeys)
    let pagination=novel.pagination
    const payload={current: 1,pageSize: pagination.pageSize,}
    for(let key in values){
      payload[key.substring(2)]=values[key]
    }
    dispatch({
      type: 'novel/fetchList',
      payload
    });
  };
  handleChange = (pagination: PaginationProps) => {
    const {
      dispatch,
      novel: { pagination: old },
    } = this.props;
    const payload: ParamType = pagination;
    if (pagination.pageSize !== old.pageSize) {
      payload.current = 1;
    }
    dispatch({
      type: 'novel/fetchList',
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
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '状态',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: resource) => (
        <span>
          <Divider type="vertical" />
        </span>
      ),
    },
  ];

  render() {
    const {
      novel,
      loading,
      form: { getFieldDecorator },
    } = this.props;
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
          <Table
            columns={this.columns}
            dataSource={novel.list}
            pagination={novel.pagination}
            onChange={this.handleChange}
          />
        </Card>
      </Spin>
    );
  }
}

export default Form.create<Props>()(Manage);
