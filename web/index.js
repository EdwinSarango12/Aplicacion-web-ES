import express from 'express';
import mysql from 'mysql2';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'base_empleados',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10
});

connection.on('connection', (conn) => {
    conn.query("SET NAMES 'utf8mb4'");
    conn.query("SET CHARACTER SET utf8mb4");
});

connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conectado a MySQL con UTF-8');
    conn.release();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET - Listar todos los empleados
app.get('/empleados', (req, res) => {
    const sql = 'SELECT * FROM personal';
    connection.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: 'Error al obtener empleados', sql });
        res.json({ sql, data: results });
    });
});

// GET - Obtener un empleado por ID
app.get('/empleados/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM personal WHERE id = ${id}`;
    connection.query('SELECT * FROM personal WHERE id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error: 'Error al obtener empleado', sql });
        if (results.length === 0) return res.status(404).json({ error: 'Empleado no encontrado', sql });
        res.json({ sql, data: results[0] });
    });
});

// POST - Crear un nuevo empleado
app.post('/empleados', (req, res) => {
    const { nombre, cargo, sueldo } = req.body;
    if (!nombre || !cargo || sueldo === undefined)
        return res.status(400).json({ error: 'nombre, cargo y sueldo son requeridos' });
    const sql = `INSERT INTO personal (nombre, cargo, sueldo) VALUES ('${nombre}', '${cargo}', ${sueldo})`;
    connection.query(
        'INSERT INTO personal (nombre, cargo, sueldo) VALUES (?, ?, ?)',
        [nombre, cargo, sueldo],
        (error, results) => {
            if (error) return res.status(500).json({ error: 'Error al crear empleado', sql });
            res.status(201).json({ sql, data: { id: results.insertId, nombre, cargo, sueldo } });
        }
    );
});

// PUT - Actualizar un empleado por ID
app.put('/empleados/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, cargo, sueldo } = req.body;
    if (!nombre || !cargo || sueldo === undefined)
        return res.status(400).json({ error: 'nombre, cargo y sueldo son requeridos' });
    const sql = `UPDATE personal SET nombre = '${nombre}', cargo = '${cargo}', sueldo = ${sueldo} WHERE id = ${id}`;
    connection.query(
        'UPDATE personal SET nombre = ?, cargo = ?, sueldo = ? WHERE id = ?',
        [nombre, cargo, sueldo, id],
        (error, results) => {
            if (error) return res.status(500).json({ error: 'Error al actualizar empleado', sql });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado', sql });
            res.json({ sql, data: { id: Number(id), nombre, cargo, sueldo } });
        }
    );
});

// DELETE - Eliminar un empleado por ID
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM personal WHERE id = ${id}`;
    connection.query('DELETE FROM personal WHERE id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error: 'Error al eliminar empleado', sql });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado', sql });
        res.json({ sql, data: { message: `Empleado ${id} eliminado correctamente` } });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
