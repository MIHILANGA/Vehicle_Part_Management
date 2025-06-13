const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: '',      
    database: 'vehicle_part_management'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
    
    // Create parts table if it doesn't exist
    db.query(`CREATE TABLE IF NOT EXISTS parts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        partType VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) throw err;
        console.log("Parts table ready");
    });
});

// Get all parts with optional filtering
app.get('/parts', (req, res) => {
    let sql = "SELECT * FROM parts WHERE 1=1";
    const params = [];
    
    // Build query based on filters
    if (req.query.name_like) {
        sql += " AND name LIKE ?";
        params.push(`%${req.query.name_like}%`);
    }
    if (req.query.partType) {
        sql += " AND partType = ?";
        params.push(req.query.partType);
    }
    if (req.query.brand_like) {
        sql += " AND brand LIKE ?";
        params.push(`%${req.query.brand_like}%`);
    }
    if (req.query.status) {
        sql += " AND status = ?";
        params.push(req.query.status);
    }
    if (req.query.price_gte) {
        sql += " AND price >= ?";
        params.push(parseFloat(req.query.price_gte));
    }
    if (req.query.price_lte) {
        sql += " AND price <= ?";
        params.push(parseFloat(req.query.price_lte));
    }
    
    db.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Get single part by ID
app.get('/parts/:id', (req, res) => {
    db.query("SELECT * FROM parts WHERE id = ?", [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send("Part not found");
        }
        res.send(result[0]);
    });
});

// Create new part
app.post('/parts', (req, res) => {
    const { name, partType, brand, quantity, price } = req.body;
    
    // Calculate status based on quantity
    let status;
    if (quantity > 10) status = "In Stock";
    else if (quantity > 0) status = "Low Stock";
    else status = "Out of Stock";
    
    db.query(
        "INSERT INTO parts (name, partType, brand, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)",
        [name, partType, brand, quantity, price, status],
        (err, result) => {
            if (err) throw err;
            res.status(201).send({ id: result.insertId, ...req.body, status });
        }
    );
});

// Update part
app.put('/parts/:id', (req, res) => {
    const { name, partType, brand, quantity, price, status } = req.body;
    
    // First get the current part to validate existence
    db.query("SELECT * FROM parts WHERE id = ?", [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send("Part not found");
        }
        
        // Calculate status if not provided
        let newStatus = status;
        if (!status && quantity !== undefined) {
            if (quantity > 10) newStatus = "In Stock";
            else if (quantity > 0) newStatus = "Low Stock";
            else newStatus = "Out of Stock";
        }
        
        db.query(
            "UPDATE parts SET name = ?, partType = ?, brand = ?, quantity = ?, price = ?, status = ? WHERE id = ?",
            [name, partType, brand, quantity, price, newStatus, req.params.id],
            (err) => {
                if (err) throw err;
                res.send({ id: req.params.id, ...req.body, status: newStatus });
            }
        );
    });
});

// Delete part
app.delete('/parts/:id', (req, res) => {
    db.query("DELETE FROM parts WHERE id = ?", [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send("Part not found");
        }
        res.send("Part deleted successfully");
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));