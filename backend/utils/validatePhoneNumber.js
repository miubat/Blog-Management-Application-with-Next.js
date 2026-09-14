export const validatePhoneNumber = (phonenumber) => {
    return /^01\d{9}$/.test(phonenumber);
}
