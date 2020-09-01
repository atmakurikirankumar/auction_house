import React, {useReducer} from "react";
import auctionsReducer from "./auctionsReducer";
import {ADD_AUCTION, AUCTIONS_ERROR, CLEAR_AUCTIONS, GET_AUCTIONS, PLACE_BID, UPLOAD_PICTURE} from "../types";
import AuctionsContext from '../auction/auctionsContext'
import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.REACT_APP_AUCTIONS_ENDPOINT,
});

const AuctionsState = (props) => {
    const initialState = {
        auctions: []
    };

    const [state, dispatch] = useReducer(auctionsReducer, initialState);

    // Get Auctions
    const getAuctions = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_AUCTIONS_ENDPOINT}/auctions`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch({
                type: GET_AUCTIONS,
                payload: res.data,
            });
        } catch (err) {
            dispatch({
                type: AUCTIONS_ERROR,
                payload: err,
            });
        }
    };

    // Clear Auctions
    const clearAuctions = async () => {
        dispatch({type: CLEAR_AUCTIONS})
    }

    //Create Auction
    const addAuction = async (formData) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_AUCTIONS_ENDPOINT}/auction`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch({
                type: ADD_AUCTION,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: AUCTIONS_ERROR,
                payload: err,
            });
        }
    }

    // Place Bid
    const placeBid = async (auction_id, formData) => {
        try {
            const res = await axios.patch(`/auction/${auction_id}/bid`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            dispatch({
                type: PLACE_BID,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AUCTIONS_ERROR,
                payload: err.response.data.msg
            });
        }
    }

    // Upload Picture
    const uploadPicture = async (auction_id, base64) => {
        try {
            const res = await axios.patch(`/auction/${auction_id}/uploadpicture`, base64, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            dispatch({
                type: UPLOAD_PICTURE,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AUCTIONS_ERROR,
                payload: err.response.data.msg
            });
        }
    }


    return (
        <AuctionsContext.Provider
            value={{
                auctions: state.auctions,
                getAuctions,
                clearAuctions,
                addAuction,
                placeBid,
                uploadPicture
            }}
        >
            {props.children}
        </AuctionsContext.Provider>
    );
};

export default AuctionsState;
