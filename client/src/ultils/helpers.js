import icons from "./icons"

const { FaStar, FaRegStar } = icons

// file hỗ trợ cho API còn sót
// Sử dụng toLowerCase() để biến đổi tiếng việt về không dấu
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

//  Định giá lại theo số tiền
export const formatMoney = (number) => {
    if (number === undefined || number === null) {
        return ""; // hoặc bất kỳ giá trị mặc định nào bạn muốn trả về khi number không hợp lệ
    }
    return Number(number.toFixed(1)).toLocaleString();
}

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return
    // render hàm cho totalratings với FaRegStar là [0] & FaStar la [1]
    // EX: 4 star => [1,1,1,1,0]
    //  Với i < + number thì sẽ thuộc hàm FaStar [1] còn ngược lại i > + number thì FaRegStar [0]
    const stars = []
    for (let i = 0; i < + number; i++) stars.push(<FaStar color="orange" size={size || 15} />)
    for (let i = 5; i > + number; i--) stars.push(<FaRegStar color="orange" size={size || 15} />)

    return stars
}
export function secondsToHms(d) {
    d = Number(d) / 1000;
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);
    return ({ h, m, s })
}
export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    // console.log(formatPayload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Require' }])
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Email invalid' }])
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Password minimum 6 characters.' }])
                }
                break;
            default:
                break;
        }
    }

    return invalids
}