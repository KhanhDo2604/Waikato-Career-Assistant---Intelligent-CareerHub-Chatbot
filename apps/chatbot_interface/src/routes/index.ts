import AdminDashboard from '../page/AdminDashboard';
import HomePage from '../page/homepage';
import Dashboard from '../page/dashboard';

const routes = [
    { path: '/', component: HomePage },
    {
        path: '/admin',
        component: AdminDashboard,
    },
     { path: '/dashboard', component: Dashboard },
];

export default routes;
