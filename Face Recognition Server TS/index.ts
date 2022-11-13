import express, { Express, Request, response, Response } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import DatabaseConstructor, {Database} from "better-sqlite3";
const db = new DatabaseConstructor('db.db');

const app: Express = express();
const port = 8000;
app.use(express.json());


app.post('/register',async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } = req.body;

  
  let query = `SELECT Username from Users where Username = '${username}';`;
  let check = db.prepare(query).all();


  if(check.length != 0){
    return res.send("Name Already Exists");
  }

  let hashedPassword = bcrypt.hashSync(password, 10);
  db.prepare(`INSERT INTO Users(username,pHash,count) VALUES ('${username}','${hashedPassword}',0)`).run();

  res.status(200).send("Registered " + username );
});



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});