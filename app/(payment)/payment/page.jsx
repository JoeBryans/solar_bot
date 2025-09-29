import React from 'react';

// 1. Define the plan data
const plans = [
    {
        name: 'Basic Plan',
        price: '$9/50 credits',
        features: [
            'Access to all features',
            'Priority support',
            'Basic analytics',
        ],
        isPopular: false,
        buttonText: 'Start Basic',
        color: 'bg-indigo-500',
    },
    {
        name: 'Pro',
        price: '$15/ 100 credits',
        features: [
            'Everything in Basic',
            'HD streaming quality',
            'Up to 5 user seats',
            'Priority chat support',
        ],
        isPopular: true,
        buttonText: 'Go Pro',
        color: 'bg-gray-500',
    },
    {
        name: 'Enterprise',
        price: '$30/200 credits',
        features: [
            ' Everything in Pro',
            'Quality analytics',
            ' Access to premium features',
            // 'Dedicated account manager',
        ],
        isPopular: false,
        buttonText: 'Start Enterprise',
        color: 'bg-green-500',
    },
];

// 2. Define the Plan Card component
const PlanCard = ({ plan }) => {
    const { name, price, features, isPopular, buttonText, color } = plan;

    return (
        <div
            className={`
        bg-white shadow-xl rounded-xl p-6 flex flex-col transition-all duration-300
        hover:scale-[1.02] relative border-2 border-gray-100 ${isPopular ? 'border-gray-500 transform scale-105' : ''}
      `}
        >
            {/* Popular Tag */}
            {isPopular && (
                <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    Most Popular
                </span>
            )}

            {/* Header */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
            <p className="text-xl font-bold text-gray-800 mb-6">{price}</p>

            {/* Features List */}
            <ul className="space-y-3 flex-grow mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                        {/* Checkmark Icon */}
                        <svg
                            className={`w-6 h-6 mr-2 text-blue-500 flex-shrink-0`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Button */}
            <button
                className={`
          mt-auto w-full py-3 rounded-lg text-white font-semibold transition duration-200
          ${color} hover:opacity-90 shadow-md ${isPopular ? 'shadow-gray-400/50' : 'shadow-none'}
        `}

           
            >
                {buttonText}
            </button>
        </div>
    );
};

// 3. Main Subscription Component
const SubscriptionPlans = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Title and Description */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl">
                        Choose the Perfect Plan
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Simple, transparent pricing that scales with your business.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10 items-center">
                    {plans.map((plan, index) => (
                        <PlanCard key={index} plan={plan} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;