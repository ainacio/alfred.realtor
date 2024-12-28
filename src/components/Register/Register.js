import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./Register.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { validateRegisterFields } from "../../utils/validation";
import { ALLOWED_TYPES, MAX_FILE_SIZE, COMPRESSION_OPTIONS } from "../../config/uploadConfig";
import imageCompression from "browser-image-compression";




const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon",
];

const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
];

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [primaryNeeds, setPrimaryNeeds] = useState("");
    const [address, setAddress] = useState({
        country: "Canada",
        street: "",
        city: "",
        region: "",
        postalOrZip: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    

    const handleRegister = async (e) => {
        e.preventDefault();
    
        const validationError = validateRegisterFields({
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            dob,
            phoneNumber,
            primaryNeeds,
            address,
            avatar, // Pass avatar for validation
        });
    
        if (validationError) {
            setError(validationError);
            return;
        }
    
        setIsLoading(true);
        setError("");
        const auth = getAuth();
        const storage = getStorage();
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
    
            let avatarUrl = "";
        if (avatar) {
            try {
                // Compress image before uploading
                const compressedAvatar = await imageCompression(avatar, COMPRESSION_OPTIONS);
                console.log("Original size:", avatar.size / 1024 / 1024, "MB");
                console.log("Compressed size:", compressedAvatar.size / 1024 / 1024, "MB");

                const avatarRef = ref(storage, `avatars/${userId}`);
                await uploadBytes(avatarRef, compressedAvatar);
                avatarUrl = await getDownloadURL(avatarRef);
            } catch (compressionError) {
                console.error("Image compression error:", compressionError);
                setError("Failed to compress the avatar image. Please try again.");
                setIsLoading(false);
                return;
            }
        }
    
            await updateProfile(userCredential.user, {
                displayName: `${title} ${firstName} ${middleName} ${lastName}`,
                photoURL: avatarUrl,
            });
    
            // Write user data to Firestore
            await setDoc(doc(db, "users", userId), {
                email,
                title,
                firstName,
                middleName,
                lastName,
                dob,
                phoneNumber,
                primaryNeeds,
                address,
                avatarUrl,
                createdAt: serverTimestamp(), // Firestore timestamp
            });
    
            console.log("User registered successfully.");
            navigate("/success");
        } catch (err) {
            setError("An error occurred during registration.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    


    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value || "" }));
    };

    return (
        <form onSubmit={handleRegister} className={styles.registerContainer}>
            <h1>Register</h1>

            <div className={styles.formGroup}>
                <label htmlFor="email">
                    Email <span className={styles.mandatory}>*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="email"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password">
                    Password <span className={styles.mandatory}>*</span>
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="new-password"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                    Confirm Password <span className={styles.mandatory}>*</span>
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="new-password"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <select
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.registerInput}
                >
                    <option value="">Select</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="firstName">
                    First Name <span className={styles.mandatory}>*</span>
                </label>
                <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="given-name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="middleName">Middle Name</label>
                <input
                    id="middleName"
                    type="text"
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className={styles.registerInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="lastName">
                    Last Name <span className={styles.mandatory}>*</span>
                </label>
                <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="family-name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="dob">Date of Birth <span className={styles.mandatory}>*</span></label>
                <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="bday"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Phone Number <span className={styles.mandatory}>*</span></label>
                <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.registerInput}
                    autoComplete="tel"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="primaryNeeds">Primary Needs <span className={styles.mandatory}>*</span></label>
                <input
                    id="primaryNeeds"
                    type="text"
                    placeholder="Primary Needs (comma-separated)"
                    value={primaryNeeds}
                    onChange={(e) => setPrimaryNeeds(e.target.value)}
                    className={styles.registerInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="country">Country <span className={styles.mandatory}>*</span></label>
                <select
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className={styles.registerInput}
                >
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="street">Street <span className={styles.mandatory}>*</span></label>
                <input
                    id="street"
                    type="text"
                    placeholder="Street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className={styles.registerInput}
                    autoComplete="address-line1"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="city">City <span className={styles.mandatory}>*</span></label>
                <input
                    id="city"
                    type="text"
                    placeholder="City"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className={styles.registerInput}
                    autoComplete="address-level2"
                />
            </div>

            {address.country === "Canada" && (
                <div className={styles.formGroup}>
                    <label htmlFor="region">Province <span className={styles.mandatory}>*</span></label>
                    <select
                        id="region"
                        name="region"
                        value={address.region}
                        onChange={handleAddressChange}
                        className={styles.registerInput}
                    >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {address.country === "United States" && (
                <div className={styles.formGroup}>
                    <label htmlFor="region">State <span className={styles.mandatory}>*</span></label>
                    <select
                        id="region"
                        name="region"
                        value={address.region}
                        onChange={handleAddressChange}
                        className={styles.registerInput}
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="postalOrZip">
                    {address.country === "Canada" ? "Postal Code" : "ZIP Code"} *
                </label>
                <input
                    id="postalOrZip"
                    type="text"
                    placeholder={address.country === "Canada" ? "Postal Code" : "ZIP Code"}
                    name="postalOrZip"
                    value={address.postalOrZip}
                    onChange={handleAddressChange}
                    className={styles.registerInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="avatar">Avatar</label>
                <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className={styles.registerInput}
                />
            </div>

            <button type="submit" className={styles.registerButton} disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
            </button>

            {error && <p className={styles.registerError}>{error}</p>}
        </form>
    );
};

export default Register;
