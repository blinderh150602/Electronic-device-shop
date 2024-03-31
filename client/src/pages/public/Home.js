import React from "react"
import { Sidebar, Banner, BestSeller, DealDaily, TypicalProducts, CustomSlider } from '../../components'
import { useSelector } from "react-redux/es/hooks/useSelector"
import icons from "../../ultils/icons"

const { IoIosArrowForward } = icons
const Home = () => {
    // HOT COLLECTIONS
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    // console.log(categories)
    // Thay đổi trọng số trong file login khi tắt web và mở lại thì giá trị của reducer bên Login sẽ được trả về null còn isLoggendIn sẽ được giữ nguyên giá trị khi được xét dưới local là true
    const {isLoggedIn, current} = useSelector(state=>state.user)
    // console.log({isLoggedIn, current})
    return (
        <>
            <div className="w-main flex">
                <div className="flex flex-col gap-5 w=[50%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5" style={{ paddingLeft: '1.25rem' }}>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className="my-8">
                <TypicalProducts />
            </div>
            <div className="my-8 w-full">
                <h3 className="text-[20px] font-semibold py-[15px]">NEW ARRIVALS</h3>
                <div className="w-full mt-4 mx-full border-t-2 border-main pt-4">
                    <CustomSlider
                        products={newProducts}
                    />
                </div>
            </div>
            <div className="my-8 w-full">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">HOT COLLECTIONS</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                    {categories?.filter(el => el.brand.length > 0)?.map(el => (
                        <div
                            key={el._id}
                            className="w-[396px]"
                        >
                            <div className="border flex p-4 gap-4 min-h-[191px]">
                                <img src={el?.image} alt="" className="w-[144px] h-[129px] object-cover" />
                                <div>
                                    <h4 className="font-semibold uppercase">{el.title}</h4>
                                    <ul className="text-sm">
                                        {el?.brand?.map(item => (
                                            <span className="flex gap-1 items-center text-gray-500" key={item}>
                                                <IoIosArrowForward />
                                                <li>{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="my-8 w-full">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">BLOGS</h3>
            </div>
        </>
    )
}
export default Home