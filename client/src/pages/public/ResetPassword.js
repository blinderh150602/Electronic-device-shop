import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis/user";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [password, setPassword] = useState(``)
    const { token } = useParams()
    // console.log(token)

    const handleResetPassword = async () => {
        try {
            const response = await apiResetPassword({ password, token })
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
    return (
        <div className="w-screen h-screen relative">
            <img src="https://cdn5.f-cdn.com/contestentries/1578585/21468461/5d62b49ac544b_thumb900.jpg" alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center justify-center py-8 z-50">
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="email" >Enter your new password:</label>
                    <input
                        type="text"
                        id="password"
                        className="w-full pb-1 border-b outline-none placeholder:text-sm md:w-[800px] bg-transparent text-white"
                        placeholder="Type here"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justufy-end gap-4 ">
                    <Button
                        name="Submit"
                        handleOnclick={handleResetPassword}
                        style='px-4 py-2 rounded-md text-white bg-blue-500 my-2 text-semibold'
                    />
                </div>
            </div>
        </div>
    )
}
export default ResetPassword