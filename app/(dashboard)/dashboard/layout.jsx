import React from 'react'
import SideBar from '../_components/SideBar'

const layout = ({ children }) => {
    return (
        <div className='w-full min-h-screen '>
            <div className='w-full h-full flex gap-4 overflow-auto scrollbar-hide'>
                <div className='w-60  relative'>
                    <SideBar />
                </div>
                <main className='w-full'>{children}</main>
            </div>
        </div>
    )
}

export default layout