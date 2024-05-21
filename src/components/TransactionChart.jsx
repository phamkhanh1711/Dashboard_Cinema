import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function TransactionChart() {
  const [transactionData, setTransactionData] = useState([]);


  const menu = JSON.parse(localStorage.getItem('bookingData')) || []

  const renderMenu = Object.keys(menu).map((key) => {
   let id = menu[key].bookingId
  //  console.log(id);
   localStorage.setItem('bookingId', JSON.stringify(id))
  })

  
  useEffect(() => {
    // Mock data creation
    const mockData = generateMockData();
    setTransactionData(mockData);
  }, []);

  // Function to generate mock data
  const generateMockData = () => {
    const data = JSON.parse(localStorage.getItem('bookingId')) || []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months.map((month) => ({
      name: month,
      Income: Math.floor(Math.random() * 5000) + 2000, // Random income value between 2000 and 7000
      Expense: Math.floor(Math.random() * 3000) + 1000, // Random expense value between 1000 and 4000
    }));
  };

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Transactions</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={transactionData}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#0ea5e9" />
            <Bar dataKey="Expense" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
