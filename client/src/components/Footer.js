import React, { memo } from "react";
import icons from "../ultils/icons";

const { MdEmail } = icons

const Footer = () => {
    return (
        <div className="w-full">r
            <div className="h-[103px] w-full bg-blue-500 flex items-center justify-center">
                <div className="w-main flex items-center justify-between">
                    <div className="flex flex-col flex-1">
                        <span className="text-[20px] text-gray-200">SIGN UP TO NEWSLETTER</span>
                        <small className="text-[13px] text-gray-300">Subscribe now and receive weekly newsletter</small>
                    </div>
                    <div className="flex-1 flex items-center">
                        <input
                            className="p-4 pr-0 rounded-l-full w-full bg-blue-300 outline-none text-gray-100 placeholder: text-sm placeholder:text-gray-100 placeholder:italic placeholder:opacity-50"
                            type="text"
                            placeholder="Email address"
                        />
                        <div className="h-[52px] w-[52px] bg-blue-300 rounded-r-full flex items-center justify-center text-white">
                            <MdEmail size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[407px] w-full bg-gray-900 flex items-center justify-center text-white text-[13px]">
                <div className="w-main flex">
                    <div className="flex-2 flex flex-col">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main p-l-[15px]">ABOUT US</h3>
                        <span>
                            <span>
                                Address:
                            </span>
                            <span className="opacity-70">
                                123HAI PHONG, Da Nang
                            </span>
                        </span>
                        <span>
                            <span>
                                Phone:
                            </span>
                            <span className="opacity-70">
                                (+1234)56789xxx
                            </span>
                        </span>
                        <span>
                            <span>
                                Mail:
                            </span>
                            <span className="opacity-70">
                                BLINDERH@ABCD.COM
                            </span>
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main p-l-[15px]">INFORMATION</h3>
                        <span className="opacity-70">Typography</span>
                        <span className="opacity-70">Gallery</span>
                        <span className="opacity-70">Store Location</span>
                        <span className="opacity-70">Today's Deals</span>
                        <span className="opacity-70">Contact</span>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main p-l-[15px]">WHO WE ARE</h3>
                        <span className="opacity-70">Help</span>
                        <span className="opacity-70">Free Shipping</span>
                        <span className="opacity-70">FAQs</span>
                        <span className="opacity-70">Return & Exchange</span>
                        <span className="opacity-70">Testimonials</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main p-l-[15px]">#DIGITALWORLDSTORE</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(Footer)