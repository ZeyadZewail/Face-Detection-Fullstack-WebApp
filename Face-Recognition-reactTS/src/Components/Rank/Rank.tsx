import * as React from "react";

interface props{
    count:number;
}

const Rank: React.FunctionComponent<props> = ({count}) =>{

    return(
        <div className="flex flex-col items-center">
           <p className="text-lg ">{`You have used this tool ${count} times`}</p>
        </div>
    );
}

export default Rank