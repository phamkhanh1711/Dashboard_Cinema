import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { FcBullish } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const linkClass =
    'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
    return (
        <div className="bg-neutral-900 w-60 p-3 flex flex-col">
            <div className="flex items-center gap-2 px-1 py-3">
                <FcBullish fontSize={24} />
                <span className="text-neutral-200 text-lg">$BHDCinema</span>
            </div>
            <div className="py-8 flex flex-1 flex-col gap-0.5">
    <Accordion
        sx={{
            background: "transparent",
            boxShadow: "none",
        }}
       
    >
        <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
        >
            <Typography
                sx={{
                    fontSize: "18px",
                    fontFamily: "'Space Grotesk',sans-serif",
                    "&:hover": {
                        color: "#f50963",
                        cursor: "pointer",
                    },
                }}
            >
                Products
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ul style={{ fontSize: "14px", listStyleType: "none", padding: 0 }}>
                {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                    <li key={link.key} style={{ marginBottom: "7px" }}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </AccordionDetails>
    </Accordion>

    {DASHBOARD_SIDEBAR_LINKS.map((link) => (
        <SidebarLink key={link.key} link={link} />
    ))}
</div>

            <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} />
                ))}
                <Link to="/register" className={classNames(linkClass, 'cursor-pointer text-red-500')}>
                    <span className="text-xl">
                        <HiOutlineLogout />
                    </span>
                    Login
                </Link>
            </div>
        </div>
    )
}

function SidebarLink({ link }) {
    const { pathname } = useLocation()

    return (
        <Link
            to={link.path}
            className={classNames(pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClass)}
        >
            <span className="text-xl">{link.icon}</span>
            {link.label}
        </Link>
    )
}
