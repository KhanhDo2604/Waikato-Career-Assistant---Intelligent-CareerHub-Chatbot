import Dashboard from '../page/dashboard';
import HomePage from '../page/homepage';
import Dashboard from '../page/dashboard';

const routes = [
    { path: '/', component: HomePage },
    {
        path: '/admin',
        component: Dashboard,
    },
     { path: '/dashboard', component: Dashboard },
];

export default routes;
