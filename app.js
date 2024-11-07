const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS y JSON
app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: "database-1.czk4e6w4q96x.us-east-2.rds.amazonaws.com", // Cambia esto por tu endpoint
  user: "ivan",
  password: "Thee385Menu062",
  database: "database1",
  connectTimeout: 10000 // Tiempo de espera de conexión
});

// Conectar a la base de datos y manejar errores
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos");
  }
});

// Endpoint de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "marceadmin" && password === "marce1987") {
    res.json({ status: "success", message: "Autenticación exitosa" });
  } else {
    res.json({ status: "error", message: "Usuario o contraseña incorrectos" });
  }
});

// Endpoint para guardar datos y generar un token QR
app.post("/guardar", (req, res) => {
  const { nombre, dni, telefono, evento } = req.body;
  const token = Math.random().toString(36).substr(2); // Genera un token aleatorio único

  const query = "INSERT INTO entradas (nombre, dni, telefono, evento, token) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [nombre, dni, telefono, evento, token], (err, result) => {
    if (err) {
      console.error("Error al guardar en la base de datos:", err);
      res.status(500).json({ status: "error", message: "Error al guardar los datos" });
    } else {
      res.json({ status: "success", token: token }); // Devuelve el token para el QR
    }
  });
});

// Endpoint para verificar el token y obtener datos de la entrada
app.get("/verificar", (req, res) => {
  const { token } = req.query;

  const query = "SELECT * FROM entradas WHERE token = ?";
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error("Error al consultar en la base de datos:", err);
      res.status(500).json({ status: "error", message: "Error al verificar el token" });
    } else if (results.length > 0) {
      res.json({ status: "success", data: results[0] }); // Devuelve los datos si el token es válido
    } else {
      res.json({ status: "not_found", message: "Entrada no encontrada o no válida" });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});

