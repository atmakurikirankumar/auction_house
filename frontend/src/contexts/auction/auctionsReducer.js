import {ADD_AUCTION, CLEAR_AUCTIONS, GET_AUCTIONS, PLACE_BID, UPLOAD_PICTURE} from "../types";

export default (state, action) => {
    const {type, payload} = action;
    switch (type) {
        case GET_AUCTIONS:
            return {
                ...state,
                auctions: payload,
                loading: false,
            };
        case ADD_AUCTION:
            return {
                ...state,
                auctions: [payload, ...state.auctions]
            }
        case PLACE_BID:
        case UPLOAD_PICTURE:
            return {
                ...state,
                auctions: state.auctions.map(auction => auction.id === payload.id ? payload : auction)
            }
        case CLEAR_AUCTIONS:
            return {
                ...state,
                auctions: [],
                error: null,
            };
        default:
            return state;
    }
};
