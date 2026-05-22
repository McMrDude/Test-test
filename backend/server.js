import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
import pg from "pg";

const app = express();
const PORT = process.env.PORT ||3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

app.post("/submit", (req, res) => {
    pool.query(`
        INSERT INTO table (text)
        VALUES ($1)
        `, [req.body.text], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Form submitted successfully!' });
        }
    });
});

app.get("/text", async (req, res) => {
    const text = await pool.query('SELECT text FROM table');
    res.json(text);
});


/*SERVER START*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});