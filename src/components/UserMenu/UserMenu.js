import styles from "./UserMenu.module.css"; // Use CSS modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../images/default-avatar.png";


const UserMenu = ({ user, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.dropdown}`) && !event.target.closest(`.${styles.container}`)) {
                setMenuOpen(false);
            }

        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div
                className={styles.greeting}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
            >
                <img
                    src={user?.photoURL || defaultAvatar}
                    alt="Avatar"
                    className={styles.avatar}
                />
                <span>Hi, {user.firstName || "User"}!</span>

            </div>
            {menuOpen && (
                <div className={styles.dropdown}>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => {
                            setMenuOpen(false);
                            navigate("/settings");
                        }}
                    >
                        Settings
                    </button>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => {
                            setMenuOpen(false);
                            onLogout();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
