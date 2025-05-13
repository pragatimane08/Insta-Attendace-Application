import React from 'react';

const StatCard = ({ data }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="flex justify-between items-center p-5 rounded-xl shadow-md bg-white transition-transform duration-200">
          <div>
            <p className="text-sm text-gray-500">{data[0].title}</p>
            <p className="text-2xl font-bold">{data[0].value}</p>
            <p className="text-sm text-gray-400">{data[0].subText}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data[0].iconBg}`}>
            {data[0].icon}
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex justify-between items-center p-5 rounded-xl shadow-md bg-white transition-transform duration-200">
          <div>
            <p className="text-sm text-gray-500">{data[1].title}</p>
            <p className="text-2xl font-bold">{data[1].value}</p>
            <p className="text-sm text-gray-400">{data[1].subText}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data[1].iconBg}`}>
            {data[1].icon}
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex justify-between items-center p-5 rounded-xl shadow-md bg-white transition-transform duration-200">
          <div>
            <p className="text-sm text-gray-500">{data[2].title}</p>
            <p className="text-2xl font-bold">{data[2].value}</p>
            <p className="text-sm text-gray-400">{data[2].subText}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data[2].iconBg}`}>
            {data[2].icon}
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex justify-between items-center p-5 rounded-xl shadow-md bg-white transition-transform duration-200">
          <div>
            <p className="text-sm text-gray-500">{data[3].title}</p>
            <p className="text-2xl font-bold">{data[3].value}</p>
            <p className="text-sm text-gray-400">{data[3].subText}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data[3].iconBg}`}>
            {data[3].icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StatCard };
