import React, {Fragment, useContext, useEffect} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import AuthContext from '../../contexts/auth/authContext'
import AuctionsContext from '../../contexts/auction/auctionsContext'

const Navbar = ({title, icon}) => {
    const authContext = useContext(AuthContext);
    const auctionsContext = useContext(AuctionsContext);
    const {isAuthenticated, logout, user, loadUser} = authContext;
    const {clearAuctions} = auctionsContext;

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    const onLogout = () => {
        logout();
        clearAuctions();
    };

    const authLinks = (
        <Fragment>
            <li>Hello <span>{user && user.name}</span></li>
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt"/> <span className="hide-sm">Logout</span>
                </a>
            </li>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
        </Fragment>
    );

    return (
        <div className="navbar bg-primary">
            <h1>
                <i className={icon}/> {title}
            </h1>
            <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
        </div>
    );
};

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
};

Navbar.defaultProps = {
    title: "Auction House",
    icon: "fa fa-id-card-alt",
};

export default Navbar;
