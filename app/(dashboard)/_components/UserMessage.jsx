import React from 'react'

const UserMessage = ({ message }) => {
    return (
        <div className='max-w-3xl w-full bg-gray-200 rounded-lg border-2 border-gray-300 p-4 text-md flex flex-col gap-2 items-start'>
            {message.prompt}
        </div>
    )
}

export default UserMessage