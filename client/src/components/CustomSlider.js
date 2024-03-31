import React, { memo } from "react";
import Slider from "react-slick"
import { Product } from './'

const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    row: 1
}

const CustomSlider = ({ products, activeTab }) => {
    return (
        <>
            {products && <Slider {...settings}>
                {products?.map((el, index) => (
                    <Product
                        key={index}
                        pid={el.id}
                        productData={el}
                        isNew={activeTab === 1 ? false : true}
                    />
                ))}
            </Slider>}
        </>
    )
}
export default memo(CustomSlider)