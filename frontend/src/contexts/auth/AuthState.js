import React, {useReducer} from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';

import {
    AUTH_ERROR,
    CLEAR_ERRORS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED
} from '../types';
import Axios from "axios";


const axios = Axios.create({
    baseURL: process.env.REACT_APP_AUCTIONS_ENDPOINT,
});

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        try {
            const res = await axios.get(`/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        } catch (err) {
            dispatch({type: AUTH_ERROR});
        }
    };

    // Register User
    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.post(`/register`, formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

            await loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/login', formData, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            await loadUser();
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // Logout
    const logout = () => dispatch({type: LOGOUT});

    // Clear Errors
    const clearErrors = () => dispatch({type: CLEAR_ERRORS});

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;
