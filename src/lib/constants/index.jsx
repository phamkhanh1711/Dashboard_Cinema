import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { IoFastFood } from "react-icons/io5";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Trang Quản Trị',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Tạo Phim',
		path: '/products',
		icon: <HiOutlineCube />
	},
	{
		key: 'food',
		label: 'Đồ Ăn Nhanh',
		path: '/food',
		icon:<IoFastFood />	
	},
	{
		key: 'orders',
		label: 'Lịch Chiếu Phim',
		path: '/showtime',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'customers',
		label: 'Thông tin khách hàng',
		path: '/customers',
		icon: <HiOutlineUsers />
	},
	{
		key: 'booking',
		label: 'Lịch Sử Đặt Vé',
		path: '/booking',
		icon: <HiOutlineDocumentText />
	},
	{
		key: 'ticket',
		label: 'Vé Khuyến Mãi',
		path: '/ticket',
		icon: <HiOutlineAnnotation />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
