import * as React from "react";


interface signInState{
    OnSignIn: any;
    OnRegister: any;
}

const SignIn: React.FunctionComponent<signInState> = ({OnSignIn,OnRegister}) =>{
    return(
        <div className="h-full place-items-center grid">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 min-w-fit w-1/5 align-middle inline-block">
                <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username" type="text" placeholder="Username"/>
                </div>
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" placeholder="******************"/>
                <p className="text-red text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-4 rounded" type="button" onClick={OnSignIn}>
                        Sign In
                    </button>
                    <button onClick={OnRegister} className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker">
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignIn