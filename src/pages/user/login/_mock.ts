import { delay } from 'roadhog-api-doc';

const authority={
  status: 'ok',
  currentUser: { id: 1, name: 'yefei' },
  currentMenu: [
    {
      path: '/system',
      name: '系统管理',
      icon: 'dashboard',
      exact: true,
      children: [
        {
          path: '/system/user',
          name: '用户管理',
          exact: true,
        },
        {
          path: '/system/role',
          name: '角色管理',
          exact: true,
        },
        {
          path: '/system/resource',
          name: '资源管理',
          exact: true,
        },
      ],
    },
  ],
}
const proxy = {
  'POST  /api/login/account': (
    req: { body: { password: any; username: any } },
    res: {
      send: (data: any) => void;
    },
  ) => {
    const { username, password } = req.body;
    if (password === 'yefei123' && username === 'yefei') {
      res.send(authority);
      return;
    }
    res.send({
      status: 'error',
    });
  },
};

export default delay(proxy, 2000);
