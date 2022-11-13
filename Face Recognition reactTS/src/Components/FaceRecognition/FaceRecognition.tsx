import * as React from "react";


interface FaceRecognitionProps{
    img:string;
    boxes:any[];
}

const FaceRecognition: React.FunctionComponent<FaceRecognitionProps> = ({img,boxes}) =>{
    
    const bounding_boxs = boxes.map((box) => {return(<div className="border-blue-600 absolute flex flex-wrap justify-center cursor-pointer shadow-sm border-4" style={{top: box.topRow,bottom: box.bottomRow,right:box.rightCol,left:box.leftCol}} ></div>)})


    return(
            <div className="flex flex-col items-center">
                <div className="w-1/3 absolute">
                    <img id="inputImage" className="h-auto w-full" src= {img}  alt=""></img>
                    {bounding_boxs}
                </div>
            </div>
    );
}

export default FaceRecognition