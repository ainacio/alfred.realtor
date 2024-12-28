import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../config/uploadConfig";

export const validateRegisterFields = ({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    dob,
    phoneNumber,
    primaryNeeds,
    address,
    avatar,
}) => {
    if (!email) return "Email is required.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!confirmPassword) return "Please confirm your password.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!firstName) return "First Name is required.";
    if (!lastName) return "Last Name is required.";
    if (!dob) return "Date of Birth is required.";
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) return "Invalid phone number format.";
    if (!primaryNeeds) return "Please specify your primary needs.";
    if (!address.street) return "Street is required.";
    if (!address.city) return "City is required.";
    if (!address.region)
        return address.country === "Canada" ? "Province is required." : "State is required.";
    if (!address.postalOrZip) {
        return address.country === "Canada"
            ? "Postal Code is required."
            : "ZIP Code is required.";
    }

    const postalZipRegex =
        address.country === "Canada"
            ? /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
            : /^[0-9]{5}(?:-[0-9]{4})?$/;

    if (!postalZipRegex.test(address.postalOrZip)) {
        return address.country === "Canada"
            ? "Invalid Postal Code format. Example: A1B 2C3"
            : "Invalid ZIP Code format. Example: 12345 or 12345-6789";
    }

    if (avatar && (!ALLOWED_TYPES.includes(avatar.type) || avatar.size > MAX_FILE_SIZE)) {
        return "Please upload a valid image file (JPEG, PNG, WebP, or AVIF) under 2MB.";
    }

    return null; // No errors
};
