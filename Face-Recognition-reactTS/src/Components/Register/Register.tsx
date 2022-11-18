import * as React from "react";


interface registerInterface{
    OnBack: any;
    OnRegister: any;
}

const Register: React.FunctionComponent<registerInterface> = ({OnBack,OnRegister}) =>{
    const [username,setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");

    const passwordChange= (e:any)=>{
        //console.log(e.target.value);
        setPassword(e.target.value)
    }
    const usernameChange= (e:any)=>{
        //console.log(e.target.value);
        setUsername(e.target.value)
    }



    return(
        <div className="h-full place-items-center grid">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 min-w-fit w-1/5 align-middle inline-block">
                <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username" type="text" onChange={usernameChange} placeholder="Username"/>
                </div>
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" onChange={passwordChange} placeholder="******************"/>
                <p className="text-red text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-4 rounded" type="button" onClick={() => {OnRegister(username,password)}}>
                        Register
                    </button>
                    <button onClick={OnBack} className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register