import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import routes from './routes';
import { ChatProvider } from './context/ChatContext';
import { DashboardProvider } from './context/DashboardContext';

function App() {
    return (
        <DashboardProvider>
            <ChatProvider>
                <Router>
                    <>
                        <Routes>
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={<route.component />} />
                            ))}
                        </Routes>
                    </>
                </Router>
            </ChatProvider>
        </DashboardProvider>
    );
}

export default App;
