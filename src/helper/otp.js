import { Auth } from "./model.js"

export const findOtp = async ()=> {
    try {
        const otp =  await Auth.findOne().lean()
        return otp
    } catch (error) {
        
    }
}