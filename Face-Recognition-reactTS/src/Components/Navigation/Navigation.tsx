import * as React from "react";
import Logo from "../Logo/logo";

interface signOutState{
    OnSignOut: any;
}


const Navigation: React.FunctionComponent<signOutState> = ({OnSignOut}) =>{
    return(
        <nav className="flex justify-between w-auto">
            <Logo></Logo>
            <p className="font-mono text-5xl text-clip p-12">AI face detector</p>
            <button className="font-mono no-underline hover:underline cursor-pointer p-6 text-3xl order-last" onClick={OnSignOut}>Sign Out</button>
        </nav>
    );
}

export default Navigation;