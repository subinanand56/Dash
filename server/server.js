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
  const data = [
    req.body.name,
    req.body.email,
    req.body.branch,
    req.body.role,
    req.body.password,
    req.body.phone,
    req.body.address,
  ];
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

          const token = jwt.sign(
            { name, role },
            "qwertyuiopasdfghjklzxcvbnmqwertyui"
          );

          return res.json({
            success: true,
            message: "Login successful",
            role,
            token,
          });
        } else {
          return res.json({
            success: false,
            message: "Role not found for the user",
          });
        }
      });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM register ";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM register WHERE id = ?";
  db.query(sql, userId, (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  });
});



app.post("/branch", (req, res) => {
  const sql = "INSERT INTO branch (`name`)VALUES (?)";
  const branchdata = [req.body.name];
  db.query(sql, [branchdata], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/getbranch", (req, res) => {
  const sql = "SELECT * FROM branch ";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/updatebranch/:id", (req, res) => {
  const branchId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name field is required for update" });
  }

  const sql = "UPDATE branch SET name = ? WHERE bid = ?";
  db.query(sql, [name, branchId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to update branch",
          error: err,
        });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Branch updated successfully" });
  });
});

app.delete("/deletebranch/:id", (req, res) => {
  const branchId = req.params.id;
  const sql = "DELETE FROM branch WHERE bid = ?";
  db.query(sql, [branchId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to delete branch",
          error: err,
        });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Branch deleted successfully" });
  });
});


app.post("/product", (req, res) => {
  const sql = "INSERT INTO product (`name`)VALUES (?)";
  const productdata = [req.body.name];
  db.query(sql, [productdata], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/product", (req, res) => {
  const sql = "SELECT * FROM product ";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/product/:id", (req, res) => {
  const productId = req.params.id;
  const newName = req.body.name;
  const sql = "UPDATEproduct SET name = ? WHERE id = ?";
  const productData = [newName, productId];

  db.query(sql, productData, (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: "Product updated successfully", result });
  });
});


app.delete("/product/:id", (req, res) => {
  const productId = req.params.id;
  const sql = "DELETE FROM product WHERE id = ?";
  const productData = [productId];

  db.query(sql, productData, (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: "Product deleted successfully", result });
  });
});
