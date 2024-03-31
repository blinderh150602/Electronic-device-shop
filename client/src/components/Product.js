import React, { useState } from "react";
import { formatMoney } from '../ultils/helpers';
import label from '../assets/label.png';
import labelBlue from '../assets/label-blue.png';
import { renderStarFromNumber } from '../ultils/helpers';
import { SelectOption } from './';
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";

const { FaEye, IoMenu, FaHeart } = icons;

const Product = ({ productData, isNew }) => {
    // Sử dụng ueState để ràng buộc để bắt sự kiện cho hàm  <SelectOption /> để đủ điều kiện sài animate
    const [isShowOption, setIsShowOption] = useState(false);

    return (
        <div className="w-full text-base px-[18px]">
            <Link
                className="w-full border p-[15px] flex-col items-center"
                to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
                onMouseEnter={() => setIsShowOption(true)}
                onMouseLeave={() => setIsShowOption(false)}
            >
                <div className="w-full relative">
                    {isShowOption && (
                        <div className="absolute bottom-[-33px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
                            <SelectOption icons={<FaEye />} />
                            <SelectOption icons={<IoMenu />} />
                            <SelectOption icons={<FaHeart />} />
                        </div>
                    )}
                    <img
                        src={productData?.thumb || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'}
                        alt=""
                        className="w-[243px] h-[243px] object-cover"
                    />
                    <img src={isNew ? label : labelBlue} alt="" className="absolute top-[-16px] left-[-25px] w-[100px] h-[35px] object-cover" />
                    {isNew
                        ? <span className="font-bold top-[-10px] left-[0px] text-white absolute">New</span>
                        : <span className="font-bold top-[-10px] left-[-10px] text-white absolute">Trending</span>
                    }
                </div>
                <div className="flex flex-col mt-[44px] items-start gap-1 w-full">
                    <span className="flex">{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className="line-clamp-1">{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)}VND`}</span>
                </div>
            </Link>
        </div>
    );
};

export default Product;
