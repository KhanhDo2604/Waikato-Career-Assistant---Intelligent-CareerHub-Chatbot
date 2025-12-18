import ChatPage from '../page/chatpage';
import Dashboard from '../page/dashboard';

const routes = [
    { path: '/', component: ChatPage },
    {
        path: '/admin',
        component: Dashboard,
    },
    { path: '/dashboard', component: Dashboard },
];

export default routes;
