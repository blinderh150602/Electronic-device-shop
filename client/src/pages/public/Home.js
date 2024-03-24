import React from "react"
import { Sidebar, Banner, BestSeller, DealDaily } from '../../components'

const Home = () => {
    return (
        <>
            <div className="w-main flex">
                <div className="flex flex-col gap-5 w=[50%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5" style={{ paddingLeft: '1.25rem'}}>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className="w-full h-[500px]"></div>
        </>
    )
}
export default Home