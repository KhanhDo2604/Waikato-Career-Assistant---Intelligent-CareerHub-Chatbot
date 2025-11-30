import AdminDashboard from '../page/AdminDashboard';
import HomePage from '../page/homepage';

const routes = [
    { path: '/', component: HomePage },
    {
        path: '/admin',
        component: AdminDashboard,
    },
];

export default routes;
