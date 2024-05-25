import React from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid'
import TransactionChart from '../components/TransactionChart'
import RecentOrders from '../components/RecentOrders'
import BuyerProfilePieChart from '../components/BuyerProfilePieChart'
import PopularProducts from '../components/PopularProducts'

export default function Dashboard() {
	return (
		<div className="flex flex-col gap-4">
			<DashboardStatsGrid />
			<div className="flex gap-5"  style={{marginLeft:"5%", marginTop:"5%"}}>
    <div className="flex-1">
        <TransactionChart />
    </div>
    <div className="flex-2">
        <BuyerProfilePieChart />
    </div>
</div>
				
			
		</div>
	)
}
