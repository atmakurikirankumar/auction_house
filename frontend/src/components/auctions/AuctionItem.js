import React, {useContext, useState} from "react";
import AuctionContext from "../../contexts/auction/auctionsContext";
import Countdown from 'react-countdown';
import moment from 'moment'

const AuctionItem = ({auction, user}) => {
    const {title, seller: {email}, minimumPriceToBid, pictureUrl, highestBid: {bidAmount, bidder}, createdAt} = auction;
    const [amount, setAmount] = useState(0);
    const onChange = (e) => setAmount(e.target.value);
    const auctionContext = useContext(AuctionContext);
    const {placeBid} = auctionContext

    const onSubmit = (e) => {
        e.preventDefault();
        placeBid(auction.id, {amount})
        setAmount(0)
    }

    return (
        <div className="card bg-light">
            <img src={pictureUrl} alt="Avatar" width={200} height={300}/>
            <h4 className="text-dark text-left">
                Title: <span className="text-primary">{title}</span>
            </h4>
            <h4 className="text-dark text-left">
                Minimum Price To Bid: <span className="text-primary">${minimumPriceToBid}</span>
            </h4>
            <h4 className="text-dark text-left">
                Deal Closing in: {<span className="text-danger"><Countdown
                date={moment(createdAt) + 1000 * 60 * 60}/></span>}
            </h4>
            <h4 className="text-dark text-left">
                Bid Amount: <span className="text-primary">{bidAmount}</span>
            </h4>
            {user.email === email ?
                (<h4 className="text-warning text-left">You cant bid on your own auction items.</h4>)
                : user.email === bidder ? (
                        <h4 className="text-warning text-left">You are the highest bidder</h4>)
                    : (
                        <div className="form-text">
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <input id="name" type="text" name="name" value={amount} onChange={onChange}/>
                                </div>
                                <input type="submit" value="Place Bid" className="btn btn-primary btn-block"/>
                            </form>
                        </div>
                    )
            }

        </div>
    );
};

export default AuctionItem;