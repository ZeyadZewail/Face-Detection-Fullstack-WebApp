import * as React from "react";
import Tilt from 'react-parallax-tilt';
import "./logo.css"
import logo from "./artificial-intelligence.png"

const Logo: React.FunctionComponent = props =>{
    return(
        <Tilt className="Tilt order-first p-6">
            <div>
                <img src={logo} alt=""></img>
            </div>
        </Tilt>
    );
}

export default Logo;