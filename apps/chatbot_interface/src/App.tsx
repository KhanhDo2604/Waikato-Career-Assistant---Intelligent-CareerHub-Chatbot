import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './page/homepage';
import Dashboard from './page/dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
