import React, {Fragment} from "react";
import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import AuctionsState from "./contexts/auction/AuctionsState";
import AuthState from "./contexts/auth/AuthState";
import AlertState from "./contexts/alert/AlertState";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alerts from "./components/layout/Alerts";
import PrivateRoute from "./components/routing/PrivateRoute";

const App = () => {
    return (
        <AuthState>
            <AuctionsState>
                <AlertState>
                    <Router>
                        <Fragment>
                            <Navbar/>
                            <div className="container">
                                <Alerts/>
                                <Switch>
                                    <PrivateRoute exact path="/" component={Home}/>
                                    <Route exact path="/register" component={Register}/>
                                    <Route exact path="/login" component={Login}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </div>
                        </Fragment>
                    </Router>
                </AlertState>
            </AuctionsState>
        </AuthState>
    );
};

export default App;
