import { createContext, useEffect, useState } from 'react';
import AccountsAPI from '../api/AccountAPI';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        AccountsAPI.checkUser().then((response) => {
            if (response.status === 200) {
                setUser(response.data);
            }
        });
    }, []);

    const logout = async () => {
        AccountsAPI.logout().then((response) => {
            if (response.status === 200) {
                setUser(null);
            } else {
                console.error(response);
            }
        });
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};