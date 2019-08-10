import { delay } from 'roadhog-api-doc';
import { ParamType, ResponseType } from './model';

const users: any[] = [];
for (let i = 0; i < 26; i++) {
  users.push({
    id: i,
    name: '测试' + i,
    username: 'test' + i,
    role: i % 3 === 0 ? '教师' : '学生',
  });
}

const getUserList = (req, res) => {
  const params = req.query as ParamType;
  const pageSize = (params.pageSize || 10) * 1;
  const current = (params.current || 1) * 1;
  const start = (current - 1) * pageSize;
  const rows = users.slice(start, start + pageSize);
  const response: ResponseType = { total: users.length, rows, current, pageSize };
  res.json(response);
};
const getUserInfo=(req,res)=>{
  const id:number=(req.query.id)*1
  res.json(users[id])
}
const proxy = {
  'GET  /api/user/list': getUserList,
  'GET  /api/user/info': getUserInfo,
};

export default delay(proxy, 1000);
