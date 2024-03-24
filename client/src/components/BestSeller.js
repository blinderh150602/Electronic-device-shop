import React, { useState, useEffect } from "react"
import { apiGetProducts } from "../apis/product"
import { Product } from './'
import Slider from "react-slick";

const tabs = [
    { id: 1, name: 'best sellers' },
    { id: 2, name: 'best product' },
]
const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    row: 1
}

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [activeTab, setActiveTab] = useState(1)
    const [products, setProducts] = useState(null)

    const fetchProducts = async () => {
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })])
        // console.log({bestSellers, newProducts})
        // Bắt điều kiện cho 2 hàm kiểm tra xem cuộc gọi API đầu tiên (response[0]) có thành công hay không. 
        // Nếu có (success là true) và sẽ được cập nhật state bestSellers và products với dữ liệu trả về từ cuộc gọi API đó.
        if (response[0].success) {
            setBestSellers(response[0].products)
            setProducts(response[0].products)
        }
        // Nếu không sẽ bắt điều kiện API thứ 2 (response[1]) nếu có sẽ thì sẽ cập nhật thẳng setProducts để trả API về
        if (response[1].success) setNewProducts(response[1].products)
        setProducts(response[0].products)
    }
    useEffect(() => {
        fetchProducts()
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
                        className={`font-semibold capitalize cursor-pointer text-gray-400 ${activeTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActiveTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className="mt-4" style={{ width: '987px', marginLeft: '-55px', marginRight: '33px', left: '0px', display: 'block', transition: 'all 800ms ease 0s', transform: 'translate3d(44px, 0px, 0px)' }}>
                <Slider {...settings}>
                    {products?.map(el => (
                        <Product
                            key={el.id}
                            pid={el.id}
                            productData={el}
                            isNew={activeTab === 1 ? false : true}
                        />
                    ))}
                </Slider>
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