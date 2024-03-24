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