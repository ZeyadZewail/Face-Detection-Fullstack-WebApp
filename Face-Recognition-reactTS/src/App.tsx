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
import Cookies from 'js-cookie';

const USER_ID = 'zeyadz';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'e3030cfa53a84e43bb29c90372b760bb';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'people-detection-yolov5';

let api = process.env.REACT_APP_API_URL?.trim();
if(api === undefined){
  api = '';
}


function App() {

  const [input,setInput] = React.useState("");
  const [img,setImg] = React.useState("");
  const [boxes,setBoxes] = React.useState<Object[]>([]);
  const [route,setRoute] = React.useState<String>('SignIn');
  const [token,setToken] = React.useState<String>('');
  const [count,setCount] = React.useState(-1);
  const [error,setError] = React.useState("");
  

  React.useEffect(()=>{
    let cookie = Cookies.get('token') as string
    setToken(cookie);
    console.log("token",Cookies.get('token'))
    if(cookie !== undefined){
      setError("");
      getCount();
      setRoute("Home");
    }
  },[token])

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

  const getCount = ()=>{
    
    const requestOptions = {
        method: 'GET',
        mode: 'cors' as RequestMode,
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        credentials:'include' as RequestCredentials
      };

    fetch(`${api}/count`,requestOptions).then((response)=> response.json()).then((jsonCount) => setCount(jsonCount.count));

  }


  let OnInputChange = (event:any) =>{
    setInput(event.target.value)
  }

  let onSubmit = () => {
    setImg(String(input));

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
        .then(result => calculateBoxes(result.outputs[0].data.regions)).then(()=>{increment()}).then(() => {getCount()})
        .catch(error => console.log('error', error));

    
  }

  let signIn = async (username:string,password:string) => {
    const requestOptions = {
      method: 'POST',
      mode: 'cors' as RequestMode,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      credentials:'include' as RequestCredentials,
      body: JSON.stringify({username:username,password:password})
    };

    let response  = await fetch(`${api}/login`,requestOptions)
    if(response.status === 404){setError("Wrong Username/Password"); return;}
    response.text().then(console.log);
    let cookie = Cookies.get('token') as string
    setToken(cookie);
  }

  let register = async (username:string,password:string) => {
    const requestOptions = {
      method: 'POST',
      mode: 'cors' as RequestMode,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      credentials:'include' as RequestCredentials,
      body: JSON.stringify({username:username,password:password})
    };

    let response = await fetch(`${api}/register`,requestOptions)
    if(response.status === 400){setError("Username already exists"); return;}
    if(response.status === 404){setError("Enter Username and password"); return;}
    response.text().then(console.log);
    signIn(username,password);
  }

  let signOut = ()=>{
    Cookies.remove('token');
    setImg('');
    setBoxes([]);
    setToken('');
    setRoute('SignIn');
  }

  let increment = () =>{
    const requestOptions = {
      method: 'PUT',
      mode: 'cors' as RequestMode,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      credentials:'include' as RequestCredentials
    };

    fetch(`${api}/increment`,requestOptions).then((response)=> response.text()).then(console.log);
  }
  
  let conditonalRender = () =>{
    switch(route){
      case 'SignIn':
        return(<SignIn OnSignIn={signIn} OnRegister={() => { setError(""); setRoute("Register"); } } error={error}/>)
      case 'Register':
        return(<Register OnBack={() => { setError(""); setRoute("SignIn"); } } OnRegister={register} error={error}/>)
      case "Home":
        return(
        <div className='flex-col  flex'>
          <Navigation OnSignOut = {signOut}/>
          <Rank count={count}/>
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
