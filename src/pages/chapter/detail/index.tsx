import React, { Component } from 'react';
import { Card, Spin,} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { StateType} from './model';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect'
import Link from 'umi/link';
import styles from './index.less';
import { parse } from 'qs';

interface Props extends FormComponentProps, ConnectProps {
  detail: StateType;
  loading: boolean;
}

@connect(
  ({
    detail,
    loading,
  }: {
    detail: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    detail,
    loading: loading.models.detail,
  }),
)
class Manage extends Component<Props, any> {

  componentDidMount() {
    const { dispatch } = this.props;
    const query=this.getPageQuery()
    dispatch({
      type: 'detail/fetchDetail',
      payload: query
    });
  }

  getPageQuery(): {
    [key: string]: string;
  } {
    return parse(window.location.href.split('?')[1]);
  }

  handlePageChange(chapterId:number){
    // const { dispatch } = this.props;
    // const query={chapterId}
    window.location.href='/chapter/detail?chapterId='+chapterId
    // dispatch({
    //   type: 'detail/fetchDetail',
    //   payload: query
    // });
  }

  render() {
    const {
      detail:{detail},
      loading,
    } = this.props;
    let directoryUrl
    if(detail){
      directoryUrl=`/chapter?novelId=${detail.novelId}`
    }
    return (
      <Spin spinning={!detail||loading}>
        {detail?(
          <div>
            <div className={styles.textcenter}>
              <span style={{ fontSize: "30px" }}>{detail.title}</span>
            </div>
            <Card bordered={false} style={{ marginLeft: "20px",width:"80%",margin:"0 auto",fontSize:"16px",lineHeight:"30px"}}>
              {detail.content}
            </Card>
            <div className={styles.textcenter} style={{marginBottom:'50px'}}>
              {detail.prev?(<a onClick={()=>{this.handlePageChange(detail.prev!)}}>上一页</a>):null}
              {directoryUrl?(<Link replace style={{margin:"20px 30px 20px 30px"}} to={directoryUrl}>目录</Link>):null}
              {detail.next?(<a onClick={()=>{this.handlePageChange(detail.next!)}}>下一页</a>):null}
            </div>
          </div>
        ):null}
      </Spin>
    );
  }
}

export default Manage;
