import './App.css'
import Sidebar from './components/layout/SideBar';
import RightCol from './components/layout/RightCol';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <main className="flex h-dvh w-full items-stretch justify-between overflow-hidden">
      <Sidebar />
      <Outlet />
      <RightCol />
    </main>
  )
}

export default App
