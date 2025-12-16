import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import routes from './routes';
import { ChatProvider } from './context/ChatContext';

function App() {
    return (
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
    );
}

export default App;
