import React, { useState, useCallback, useEffect } from "react"
import { InputField, Button } from "../../components"
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis/user"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import path from "../../ultils/path"
import { login } from "../../store/user/userSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { validate } from "../../ultils/helpers"

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const [isRegister, setIsRegister] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const [email, setEmail] = useState('')
    const handleForgotPassword = async () => {
        try {
            const response = await apiForgotPassword({ email })
            // console.log(response)
            if (response.success) {
                toast.success(response.mes, { theme: 'green' })
            } else {
                toast.error(response.mes, { theme: 'red' })
            }
        } catch (error) {
            console.error('Error handling forgot password:', error)
            toast.error('An error occurred. Please try again later.', { theme: 'red' })
        }
    }
    useEffect(() => {
        resetPayload()
    }, [isRegister])
    // SUBMIT
    // console.log(validate(payload))
    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload

        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
        // console.log(invalids)
        if (invalids === 0) {
            try {
                if (isRegister) {
                    const response = await apiRegister(payload)
                    // Hàm xử lý sự kiện tạo tài khoản
                    if (response && response.success) {
                        Swal.fire('Congratulations', response.mes, 'success').then(() => {
                            setIsRegister(false)
                            resetPayload()
                        });
                    } else {
                        Swal.fire('Oops!', response ? response.mes : 'An error occurred. Please try again later.', 'error')
                    }
                } else {
                    const rs = await apiLogin(data);
                    if (rs.success) {
                        dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                        // Call Api for login account to page Home
                        navigate(`/${path.HOME}`);
                    } else Swal.fire('Oops!', rs.mes, 'Error!')
                    // console.log(rs)
                }
            } catch (error) {
                // console.error('Error:', error)
                Swal.fire('Oops!', 'An error occurred. Please try again later.', 'error')
            }
        }
    }, [payload, isRegister, navigate])
    return (
        <div className="w-screen h-screen relative">
            <img src="https://cdn5.f-cdn.com/contestentries/1578585/21468461/5d62b49ac544b_thumb900.jpg" alt=""
                className="w-full h-full object-cover"
            />
            {isForgotPassword && <div className="absolute animate-slide-top top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center justify-center py-8 z-50">
                <div className="flex flex-col w-full items-center gap-2">
                    <label htmlFor="email">Enter your email:</label>
                    <input
                        type="text"
                        id="email"
                        className="w-full pb-1 border-b outline-none placeholder:text-sm md:w-[800px] bg-transparent text-white"
                        placeholder="abcd@gmail.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex items-center justufy-end gap-4 ">
                    <Button
                        name="Submit"
                        handleOnclick={handleForgotPassword}
                        style='px-4 py-2 rounded-md text-white bg-blue-500 my-2 text-semibold'
                    />
                    <Button
                        name="Back"
                        handleOnclick={() => setIsForgotPassword(false)}
                    />
                </div>
            </div>}
            <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <div className="p-8 bg-white items-center rounded-md min-w-[600px] ">
                    <h1 className="text-[33px] flex flex-col items-center font-semibold text-main mb-8"> {isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister && <div className="flex items-center gap-2">
                        < InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey="firstname"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                        < InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey="lastname"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>
                    }
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey="mobile"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey="password"
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnclick={handleSubmit}
                        fw
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {/* Bắt sự kiện onclick để xuất ra trang forgotpassword */}
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">Forgot your account?</span>}
                        {!isRegister && <span
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => setIsRegister(true)}
                        >Create account</span>}
                        {isRegister && <span
                            className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                            onClick={() => setIsRegister(false)}
                        >Back to login</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
