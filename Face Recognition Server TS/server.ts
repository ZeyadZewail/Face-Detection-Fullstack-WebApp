import express, { Express, Request, response, Response,NextFunction } from 'express';
import bcrypt, { hash } from 'bcrypt';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import DatabaseConstructor, {Database} from "better-sqlite3";
import { nextTick } from 'process';
const db = new DatabaseConstructor('db.db');

const app: Express = express();
const port = 8000;
app.use(express.json());
app.use(cookieParser());

const jwtKey = 'yrQwR(Tv&dS6xWG9z2ray5G(xekN)UbbuNr%hnu%';
const jwtExpirySeconds = 300;

app.post('/register', (req: Request, res: Response) => {
  let { username, password }: { username: string; password: string } = req.body;
  username = username.toLowerCase();
  
  const query = db.prepare('SELECT Username from Users where Username = ?;');
  let check = query.all(username);


  if(check.length != 0){
    return res.send("Name Already Exists");
  }

  let hashedPassword = bcrypt.hashSync(password, 10);
  db.prepare(`INSERT INTO Users(username,pHash,count) VALUES (?,?,0)`).run(username,hashedPassword);

  res.status(200).send("Registered " + username );
});

app.post('/login', (req: Request, res: Response) => {
  let { username, password }: { username: string; password: string } = req.body;
  username = username.toLowerCase();

  const query = db.prepare('SELECT pHash from Users where Username = ?;');
  let result = query.get(username);

  let passwordCorrect = bcrypt.compareSync(password,result.pHash);

  if(!passwordCorrect){
    return res.send("wrong password");
  }


  const token = jwt.sign({ username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	});


  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
	res.send("Logged in");


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

  next();

}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});