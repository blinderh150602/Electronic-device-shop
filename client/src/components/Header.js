import React from 'react'
import logo from '../assets/logo.png'
import icons from '../ultils/icons'
import {Link} from 'react-router-dom'
import path from '../ultils/path'

const {BsFillTelephoneFill, MdEmail, BsCartFill, BiUserCircle} = icons
const Header = () => {
    return(
        <div className="w-main flex justify-between h-[110px] py-[35px]">
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>
            <div className='flex text-[13px]'>
                <div className='flex flex-col px-6 border-r items-center'>
                    <span className='flex gap-4 items-center'>
                        <BsFillTelephoneFill color='red' />
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className='flex flex-col px-6 border-r items-center'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold'>BLINDERH@ABCD.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                <div className='flex items-center px-6 border-r justify-center gap-2'>
                    <span className='flex gap-2 items-center'>
                        <BsCartFill color='red' />
                        <span>0 item(s)</span>
                    </span>
                </div>
                <div className='flex items-center px-6 justify-center'><BiUserCircle size={30}/></div>
            </div>
            </div>
    )
}
export default Header