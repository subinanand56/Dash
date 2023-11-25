import express from "express";
import cors from "cors";
import mysql from "mysql";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());


app.listen(8081, () => {
  console.log("Server Running");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dashboard",
});
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("MySQL Connected...");
  });

app.post("/register", (req, res) => {
    const sql =
      "INSERT INTO register (`name`,`email`,`branch`,`role`,`password`,`phone`,`address`)VALUES (?)";
      const data = [req.body.name,req.body.email,req.body.branch,req.body.role,req.body.password,req.body.phone,req.body.address];
      db.query(sql, [data], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      });
      
  });

  
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const sql = "SELECT * FROM register WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
      if (err) return res.json(err);
  
      if (result.length > 0) {
        const roleQuery = "SELECT role FROM register WHERE email = ?";
        db.query(roleQuery, [email], (roleErr, roleResult) => {
          if (roleErr) return res.json(roleErr);
  
          if (roleResult.length > 0) {
            const name = result[0].name;
            const role = roleResult[0].role; // Fetch the role from the result
  
            const token = jwt.sign({ name, role }, "qwertyuiopasdfghjklzxcvbnmqwertyui");
  
            return res.json({ success: true, message: "Login successful", role, token });
          } else {
            return res.json({ success: false, message: "Role not found for the user" });
          }
        });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  });
  
  app.post("/branch", (req, res) => {
    const sql =
      "INSERT INTO branch (`name`)VALUES (?)";
      const branchdata = [req.body.name];
      db.query(sql, [branchdata], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      });
      
  });

  app.get("/getbranch", (req, res) => {
    const sql =
      "SELECT * FROM branch ";
      db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      });
      
  });
  app.get("/updatebranch", (req, res) => {
    const sql =
      "SELECT * FROM branch WHERE ID = ?";
      const id =req.params.id;
      db.query(sql,[id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      });
      
  });
  


