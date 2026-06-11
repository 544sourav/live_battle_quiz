import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/core/Sidebar"


export const Dashboard = () => {
  
  return (
    <div className=' relative flex h-[calc(100vh)] bg-background'>
    
            <Sidebar/>
            <div className=' flex-1 overflow-auto  p-6 '>
                <div className='  '>
                    <Outlet/>
                </div>
            </div>
    
           </div>
  )
}

