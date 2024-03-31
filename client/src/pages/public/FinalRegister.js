import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import path from "../../ultils/path";
import Swal from 'sweetalert2';

// File để liên kết khi email được gửi sang trang Login
const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (status === 'failed') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Đăng kí không thành công',
                }).then(() => {
                    navigate(`/${path.LOGIN}`);
                });
            }
            if (status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Congratulation!',
                    text: 'Đăng kí thành công. Hãy đăng nhập',
                }).then(() => {
                    navigate(`/${path.LOGIN}`);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'An error occurred. Please try again later.',
            }).then(() => {
                navigate(`/${path.LOGIN}`);
            });
        }
    }, [status, navigate]);

    return (
        <Navigate to={`/${path.LOGIN}`} state={{ status }} />
    );
};

export default FinalRegister;
