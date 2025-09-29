import React from 'react'

const AiMessage = ({ message }) => {
    return (
        <div className=' w-full relative flex flex-col  gap-2  items-end'>

            <div className='max-w-4xl w-full bg-gray-100 rounded-lg border-2 p-4 text-md flex flex-col gap-2 '>

                <span>{message.title}</span>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Load Analysis</h2>
                    <p>Total Load: {message.loadAnalysis.totalLoad}</p>
                    <p>Daily Usage Duration: {message.loadAnalysis.dailyUsageDuration}</p>
                    <p>Daily Energy Consumption: {message.loadAnalysis.dailyEnergyConsumption}</p>
                </article>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Battery Bank And Sizing</h2>
                    <span> {message.batteryBankSizing}</span>

                </article>

                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Solar PV Array Sizing</h2>
                    <span> {message.solarPVArraySizing}</span>

                </article>

                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Charge Controller Sizing</h2>
                    <span> {message.chargeControllerSizing}</span>

                </article>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Inverter Sizing</h2>
                    <span> {message.inverterSizing}</span>

                </article>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Summary</h2>
                    <span> {message.summary}</span>

                </article>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Suggestions</h2>
                    <span> {message.suggestions}</span>

                </article>
                <article className='flex flex-col gap-2'>
                    <h2 className='text-xl font-semibold'>Notes</h2>
                    <span> {message.notes}</span>
                </article>

            </div>
        </div>
    )
}

export default AiMessage