import React, { memo } from "react";
import path from "../ultils/path";
import { Link } from "react-router-dom";

const TopHeaders = () => {
    return (
        <div className="h-[38px] w-full bg-blue-500 flex items-center justify-center">
            <div className="w-main flex items-center justify-between text-xs text-white">
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>Sign In or Create Account</Link>
            </div>
        </div>
    )
}
export default memo(TopHeaders)