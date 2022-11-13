import React from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const USER_ID = 'zeyadz';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'e3030cfa53a84e43bb29c90372b760bb';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'people-detection-yolov5';




function App() {

  const [input,setInput] = React.useState("");
  const [img,setImg] = React.useState("");
  const [boxes,setBoxes] = React.useState<Object[]>([]);
  const [route,setRoute] = React.useState<String>('SignIn');

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
      await console.log(container);
  }, []);

  let calculateBoxes = (data:Array<any>) => {
    let boxes = []
    let Image = document.getElementById("inputImage");
    let width = Number(Image?.clientWidth);
    let height = Number(Image?.clientHeight);
    for(let element of data){
      let box = {
        leftCol: element.region_info.bounding_box.left_col*100 + '%',
        topRow: element.region_info.bounding_box.top_row*100 + '%',
        rightCol: (1- element.region_info.bounding_box.right_col)*100 + '%',
        bottomRow: (1 - element.region_info.bounding_box.bottom_row)*100 + '%'
      }
      
      boxes.push(box);
    }
    
    setBoxes(boxes);
  }


  let OnInputChange = (event:any) =>{
    setInput(event.target.value)
  }

  let onSubmit = () => {
    setImg(String(input));
    console.log("pressed");

    let raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": String(input)
                  }
              }
          }
      ]
    })

    let requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
        .then(response => response.json())
        .then(result => calculateBoxes(result.outputs[0].data.regions))
        .catch(error => console.log('error', error));
  }

  let signInCheck = () => {
    setRoute("Home");
  }

  
  let conditonalRender = () =>{
    switch(route){
      case 'SignIn':
        return(<SignIn OnSignIn={signInCheck} OnRegister={() => {setRoute("Register")}}/>)

      case 'Register':
        return(<Register OnBack={() => {setRoute("SignIn")}} OnRegister/>)
      case "Home":
        return(
        <div className='flex-col  flex'>
          <Navigation OnSignOut = {() => {setRoute("SignIn")}}/>
          <Rank/>
          <ImageLinkForm OnInputChange = {OnInputChange} OnSubmit = {onSubmit}/>
          <FaceRecognition img={img} boxes={boxes}/>
        </div>
        )
      
    }
  }

  return (
      <div className='app font-mono'>
        <Particles className='particles' id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
              options={{
                  fpsLimit: 120,
                  particles: {
                      color: {
                          value: "#ffffff",
                      },
                      links: {
                          color: "#ffffff",
                          distance: 150,
                          enable: true,
                          opacity: 0.5,
                          width: 1,
                      },
                      move: {
                          direction: "none",
                          enable: true,
                          random: false,
                          speed: 6,
                          straight: false,
                      },
                      number: {
                          density: {
                              enable: true,
                              area: 800,
                          },
                          value: 80,
                      },
                      opacity: {
                          value: 0.5,
                      },
                      shape: {
                          type: "circle",
                      },
                      size: {
                          value: { min: 1, max: 5 },
                      },},detectRetina: true,}}/>
        
        {conditonalRender()}
      
    </div>
    
  );
}

export default App;
