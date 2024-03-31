import React, { useState, useEffect } from "react"
import { apiGetProducts } from "../apis/product"
import { Product, CustomSlider } from './'
import { getNewProducts } from "../store/products/asyncActions"
import { useDispatch, useSelector } from "react-redux"

const tabs = [
    { id: 1, name: 'best sellers' },
    { id: 2, name: 'best product' },
]

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [activeTab, setActiveTab] = useState(1)
    const [products, setProducts] = useState(null)
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)
    // console.log(newProducts)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        // console.log({ bestSellers, newProducts })
        // Bắt điều kiện cho 2 hàm kiểm tra xem cuộc gọi API đầu tiên (response[0]) có thành công hay không. 
        // Nếu có (success là true) và sẽ được cập nhật state bestSellers và products với dữ liệu trả về từ cuộc gọi API đó.
        if (response.success) {
            setBestSellers(response.products)
            setProducts(response.products)
        }
    }
    useEffect(() => {
        fetchProducts()
        dispatch(getNewProducts())
    }, [])
    // Bắt hàm phụ thuộc vào 2 setProducts chính hàm xử lý nút sẽ ở dưới
    useEffect(() => {
        if (activeTab === 1) setProducts(bestSellers)
        if (activeTab === 2) setProducts(newProducts)
    }, [activeTab])
    return (
        <div className="flex flex-col">
            <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    // Trả điều kiện hàm bấm để call API cho 2 nút chính là bestSellers và newProducts
                    <span
                        key={el.id}
                        className={`font-semibold uppercase cursor-pointer text-gray-400 ${activeTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActiveTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className="mt-4" style={{ width: '989px', marginLeft: '-55px', marginRight: '33px', left: '0px', display: 'block', transition: 'all 800ms ease 0s', transform: 'translate3d(55px, 0px, 0px)' }}>
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
            <div className="w-full flex gap-4 mt-8">
                <img src="//digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className="flex-1 object-contain"
                />
                <img src="//digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className="flex-1 object-contain"
                />
            </div>
        </div>
    )
}

export default BestSeller