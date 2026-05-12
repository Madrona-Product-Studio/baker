import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Plan } from './pages/Plan';
import { Feed } from './pages/Feed';
import { CheckIn } from './pages/CheckIn';
import { Emergency } from './pages/Emergency';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-paper text-forest flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/emergency" element={<Emergency />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
