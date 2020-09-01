import React, {useContext, useEffect} from "react";
import AuctionsContext from '../../contexts/auction/auctionsContext'
import AuthContext from '../../contexts/auth/authContext'
import AuctionItem from "./AuctionItem";
import Spinner from "../layout/Spinner";

const Auctions = () => {

    const auctionsContext = useContext(AuctionsContext);
    const authContext = useContext(AuthContext)

    const {auctions, getAuctions, loading} = auctionsContext;
    const {loadUser, user} = authContext;

    useEffect(() => {
        loadUser()
        // setInterval(getAuctions, 5000)
        getAuctions()
        // eslint-disable-next-line
    }, []);

    if (auctions !== null && auctions.length === 0 && !loading) {
        return <h4>No Auctions available</h4>;
    }

    return (
        <div className="grid-3">
            {auctions !== null && !loading ? (auctions.map(auction => <AuctionItem auction={auction} user={user}
                                                                                   key={auction.id}/>)) : (<Spinner/>)}
        </div>

    );
};

export default Auctions;