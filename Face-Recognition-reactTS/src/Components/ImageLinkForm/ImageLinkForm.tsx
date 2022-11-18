import * as React from "react";

interface ImageLinkFormState{
    OnInputChange: any;
    OnSubmit: any;
}

const ImageLinkForm: React.FunctionComponent<ImageLinkFormState> = ({OnInputChange,OnSubmit}) =>{

    return(
        <div className="flex flex-col items-center">
            <p className="text-6xl p-20">Input an image link and detect faces!</p>
            <div className="w-1/2 flex">
                <input className="text-lg py-1 px-2 ring-1 ring-slate-900/10 text-slate-500 rounded-lg shadow-sm
                    dark:bg-slate-800 dark:ring-0 dark:highlight-white/5 dark:text-slate-400 w-11/12 my-3" type="text" onChange={OnInputChange}></input>
                <button className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 my-3 mx-2 
                transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline" onClick={OnSubmit}>Detect</button>
            </div>
        </div>

    );
    
}

export default ImageLinkForm;