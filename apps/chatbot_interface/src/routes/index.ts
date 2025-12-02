import Dashboard from '../page/dashboard';
import HomePage from '../page/homepage';

const routes = [
    { path: '/', component: HomePage },
    {
        path: '/admin',
        component: Dashboard,
    },
];

export default routes;
