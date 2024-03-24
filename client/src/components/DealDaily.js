import React, { useState, useEffect, memo } from "react";
import icons from "../ultils/icons";
import { apiGetProducts } from "../apis/product";
import { renderStarFromNumber, formatMoney } from '../ultils/helpers'
import { CountDown } from './'

const { FaStar, IoMenu } = icons

const DealDaily = () => {
    const [dealdaily, setDealdaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    let idInterval = null // Khai báo idInterval ở mức độ phạm vi của component

    const fetchDealDaily = async () => {
        const respone = await apiGetProducts({ limit: 1, page: Math.round(Math.random() * 10), totalRatings: 5 })
        if (respone.success) {
            setDealdaily(respone.products[0])
            setHour(1)
            setMinute(2)
            setSecond(2)
        }
    }

    useEffect(() => {
        if (idInterval) clearInterval(idInterval) // Kiểm tra và xóa interval nếu đã tồn tại
        fetchDealDaily();
    }, [expireTime])

    useEffect(() => {
        idInterval = setInterval(() => { // Đặt idInterval ở mức độ phạm vi của useEffect
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(2)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(2)
                        setSecond(2)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])
    return (
        <div className="border w-full flex-auto">
            <div className="flex items-center justify-between">
                <span className="flex-1 flex justify-center"><FaStar size={20} color="#DD1111" /></span>
                <span className="flex-8 font-bold text-[20px] flex justify-center text-gray-700">DEAL DAILY</span>
                <span className="flex-1"></span>
            </div>
            <div className="w-full flex flex-col items-center pt-20 gap-1">
                <img
                    src={dealdaily?.thumb || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'}
                    alt=""
                    className="w-full object-contain" style={{ width: '100%', height: '212px' }}
                />
                <div className="pt-9 flex-8 font-bold text-[20px] text-gray-700">
                    <span className="line-clamp-1 flex justify-center">{dealdaily?.title}</span>
                    <span className="flex flex justify-center">{renderStarFromNumber(dealdaily?.totalRatings, 25)}</span>
                    <span className="flex justify-center pt-2">{`${formatMoney(dealdaily?.price)}VND`}</span></div>
            </div>
            <div className="px-4 mt-8">
                <div className="flex justify-center gap-2 items-center mb-4">
                    <CountDown unit={'Hours'} number={hour} />
                    <CountDown unit={'Minutes'} number={minute} />
                    <CountDown unit={'Seconds'} number={second} />
                </div>
                <button
                    type="button"
                    className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
                >
                    <IoMenu />
                    <span>OPTIONS</span>
                </button>
            </div>
        </div>
    )
}
export default memo(DealDaily)