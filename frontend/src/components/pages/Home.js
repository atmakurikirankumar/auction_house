import React, {Fragment} from "react";
import Auctions from "../auctions/Auctions";
import AuctionForm from "../auctions/AuctionForm";

const Home = () => {

    return (
        <Fragment>
            <div className="grid-2-3">
                <div>
                    <AuctionForm/>
                </div>
            </div>
            <hr/>
            <div>
                <Auctions/>
            </div>
        </Fragment>
    );
};

export default Home;
