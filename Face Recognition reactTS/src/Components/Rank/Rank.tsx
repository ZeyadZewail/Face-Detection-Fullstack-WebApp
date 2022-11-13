import * as React from "react";


const Rank: React.FunctionComponent = props =>{
    return(
        <div className="flex flex-col items-center">
           <p className="text-lg ">{`You are ranked # in usage.`}</p>
        </div>
    );
}

export default Rank