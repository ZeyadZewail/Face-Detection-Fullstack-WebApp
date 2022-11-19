import express, { Express, Request, response, Response,NextFunction } from 'express';
import bcrypt, { hash } from 'bcrypt';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import DatabaseConstructor, {Database} from "better-sqlite3";
import path from 'path';
const db = new DatabaseConstructor('db.db');

const app: Express = express();
const port = 8080;
app.use(express.json());
app.use(cors({credentials:true,origin:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"..","../Face-Recognition-reactTS","build")));
app.use(express.static("public"));

const jwtKey = 'yrQwR(Tv&dS6xWG9z2ray5G(xekN)UbbuNr%hnu%';
const jwtExpirySeconds = 300;

//static file serving
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"..","../Face-Recognition-reactTS","build", "index.html"));
});


const auth =  (req: Request, res: Response,next:NextFunction) => {
  let { token}: { token:any } = req.cookies;

  if (!token) {
		return res.status(401).end()
	}

  let payload:any;
	try {
		payload = jwt.verify(token, jwtKey)
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).end()
		}
		return res.status(400).end()
	}

  console.log("Authenticated");
  next();

}

app.post('/register', (req: Request, res: Response) => {
  let { username, password }: { username: string; password: string } = req.body;
  if(!username || !password){
    return res.status(404).end();
  }

  username = username.toLowerCase();
  
  const query = db.prepare('SELECT Username from Users where Username = ?;');
  let check = query.all(username);


  if(check.length != 0){
    return res.send("Name Already Exists");
  }

  let hashedPassword = bcrypt.hashSync(password, 10);
  db.prepare(`INSERT INTO Users(username,pHash,count) VALUES (?,?,0)`).run(username,hashedPassword);

  console.log("Registered " + username );
  res.status(200).send("Registered " + username );
});

app.post('/login', (req: Request, res: Response) => {
  let { username, password }: { username: string; password: string } = req.body;
  if(!username || !password){
    return res.status(404).end();
  }

  username = username.toLowerCase();

  const query = db.prepare('SELECT pHash from Users where Username = ?;');
  let result = query.get(username);

  if(result === undefined){
    console.log("Wrong username/password");
    return res.status(404).send("Wrong username/password");
  }

  let passwordCorrect = bcrypt.compareSync(password,result.pHash);

  if(!passwordCorrect){
    return res.status(404);
  }


  const token = jwt.sign({ username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	});


  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000});
	res.status(200).send("logged in");


});

app.put('/increment',auth, (req: Request, res: Response) => {
  let {token}: { token:any } = req.cookies;

  const decodedToken = jwt.decode(token) as { username: string }; // <--- Cast here for Typescript
  const { username } = decodedToken;

  const query = db.prepare('UPDATE Users SET Count = Count+1 where Username = ?;');
  query.run(username);
  
  res.status(200).end();
  
});

app.get('/count', (req: Request, res: Response) => {

  let {token}: { token:any } = req.cookies;

  const decodedToken = jwt.decode(token) as { username: string }; // <--- Cast here for Typescript
  if(decodedToken === null){
    return res.status(404).end();
  }

  const { username } = decodedToken;

  const query = db.prepare('SELECT Count from Users where Username = ?;');
  let {Count} = query.get(username);
  if(Count === null){
    return res.status(404).end();
  }

  Count = JSON.stringify({count:Count});

  res.status(200).send(Count);

});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});