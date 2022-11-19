import * as React from "react";
import { updateFor } from "typescript";


interface signInState{
    OnSignIn: any;
    OnRegister: any;
    error:string
}

const SignIn: React.FunctionComponent<signInState> = ({OnSignIn,OnRegister,error}) =>{
    const [username,setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");
    //const [error,setError] = React.useState(false);


    const conditionalError = () => {
        if(error !== ""){
            return(
            <div className="bg-red-400 rounded p-1 my-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-5 inline-block pr-1" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
            </div>)
        }else{
            return <div></div>
        }
    }



    
    
    
    

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
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username" onChange={usernameChange} type="text" placeholder="Username"/>
                </div>
                {conditionalError()}
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" onChange={passwordChange} placeholder="******************"/>
                <p className="text-red text-xs italic">Please choose a password.</p>
                </div>
                
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-4 rounded" type="button" onClick={()=> {OnSignIn(username,password)}}>
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