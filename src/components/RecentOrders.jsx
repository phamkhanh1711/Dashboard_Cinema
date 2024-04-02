import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function RecentOrders() {
  const [recentOrderData, setRecentOrderData] = useState([]);



  const url = "http://localhost:8081/form_add_book";

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        setRecentOrderData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Recent Orders</strong>
      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {recentOrderData.map((order) => (
              <tr key={order.book_id}>
                <td>
                  <Link to={`/order/${order.book_id}`}>{order.book_id}</Link>
                </td>
                <td>{order.book_title}</td>
                <td>{order.category_name}</td>
                <td>
                  <img src={`http://localhost:8081/public/upload/${order.image_path}`}  style={{ maxWidth: '50px', maxHeight: '50px' }} />
                </td>
                <td>{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
