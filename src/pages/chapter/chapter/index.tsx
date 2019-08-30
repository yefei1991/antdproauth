import React, { Component } from 'react';
import { Card, Spin,Row,Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { StateType } from './model';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect'
import Link from 'umi/link';
import { parse } from 'qs';

interface Props extends FormComponentProps, ConnectProps {
  chapter: StateType;
  loading: boolean;
}

@connect(
  ({
    chapter,
    loading,
  }: {
    chapter: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    chapter,
    loading: loading.models.chapter,
  }),
)
class Manage extends Component<Props, any> {

  componentDidMount() {
    const { dispatch } = this.props;
    const query=this.getPageQuery()
    console.info(1)
    dispatch({
      type: 'chapter/fetchList',
      payload: query
    });
  }

  getPageQuery(): {
    [key: string]: string;
  } {
    return parse(window.location.href.split('?')[1]);
  }

  render() {
    const {
      chapter,
      loading,
    } = this.props;
    return (
      <Spin spinning={loading}>
        <div style={{ margin: "20px auto 0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "30px" }}>{chapter.novel}</span>
          <span style={{ marginLeft: "20px" }}>{chapter.author}</span>
        </div>
        <Card bordered={false} style={{ marginLeft: "50px" }}>
          <Row>
            {chapter.list.map(v => (
              <Col key={v.id} span={6}>
                <Link to='/chapter/detail' target="_blank">{v.title}</Link>
              </Col>
            ))}
          </Row>
        </Card>
      </Spin>
    );
  }
}

export default Manage;
