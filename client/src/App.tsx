import './App.css'
import Sidebar from './components/layout/SideBar';
import RightCol from './components/layout/RightCol';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <main className="flex h-dvh min-h-0 w-full min-w-0 items-stretch overflow-hidden">
      <Sidebar />
      <Outlet />
      <RightCol />
    </main>
  )
}

export default App
