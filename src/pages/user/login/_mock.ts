import { delay} from 'roadhog-api-doc';

const proxy={
    'POST  /api/login/account': (
        req: { body: { password: any; username: any; } },
        res: {
            send: (data: any) => void;
        },
    ) => {
        const { username, password } = req.body;
        if (password === 'yefei123' && username === 'yefei') {
            res.send({
                status: 'ok',
                currentUser: { id: 1, name: 'yefei' },
                currentMenu: [
                    {
                        "path": "/dashboard",
                        "name": "dashboard",
                        "icon": "dashboard",
                        "exact": true,
                        "children": [
                            {
                                "path": "/dashboard/analysis",
                                "name": "analysis",
                                "exact": true
                            },
                            {
                                "path": "/dashboard/monitor",
                                "name": "monitor",
                                "exact": true
                            },
                            {
                                "path": "/dashboard/workplace",
                                "name": "workplace",
                                "exact": true
                            }
                        ]
                    }
                ]
            });
            return;
        }
        res.send({
            status: 'error',
        });
    },
}

export default delay(proxy, 2000);