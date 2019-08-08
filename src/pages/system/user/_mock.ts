import { delay } from 'roadhog-api-doc';

const users:any[]=[]
for(let i=0;i<26;i++){
    users.push({
        id:i,
        name:'测试'+i,
        username:'test'+i,
        role:i%3===0?'教师':'学生',
    });
}

const getUserList = (req, res) => {
    const params = req.query
    const count = params.page * 1 || 10
    const current=params.current*1||1
    const start=(current-1)*count
    const rows=users.slice(start,start+count)
    res.json({total:users.length,rows:rows})
}
const proxy = {
  'GET  /api/user/list': getUserList,
};

export default delay(proxy, 2000);
