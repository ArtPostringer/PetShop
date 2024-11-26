const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// ===================== ROTAS CRUD clientes ======================= \\

app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

app.post('/clientes', (req, res) => {
    const { nome, telefone, endereco } = req.body;
    db.query('INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)', [nome, telefone, endereco], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, nome, telefone, endereco });
    });
});

app.get('/clientes/:id', (req, res) => {
    const { id } = req.params; 

    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ message: 'Erro ao buscar cliente' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json(result[0]);
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params; 
    const { nome, telefone, endereco } = req.body; 

    db.query(
        'UPDATE clientes SET nome = ?, telefone = ?, endereco = ? WHERE id = ?',
        [nome, telefone, endereco, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar cliente:', err);
                return res.status(500).json({ message: 'Erro ao atualizar cliente' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            res.json({ message: 'Cliente atualizado com sucesso!', id, nome, telefone, endereco });
        }
    );
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir cliente:', err);
            return res.status(500).json({ message: 'Erro ao excluir cliente' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente excluído com sucesso!' });
    });
});


// ===================== ROTAS CRUD animais ======================= \\

app.get('/animais', (req, res) => {
    const query = `
        SELECT 
            animais.id, 
            animais.nome AS animal_nome, 
            animais.idade, 
            animais.tipo, 
            clientes.nome AS dono_nome
        FROM animais
        JOIN clientes ON animais.cliente_id = clientes.id
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Erro ao buscar animais:', err);
            return res.status(500).json({ message: 'Erro ao buscar animais' });
        }
        res.json(result);
    });
});

app.get('/animais/:id', (req, res) => {
    const { id } = req.params;  
    const query = 'SELECT * FROM animais WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar animal:', err);
            return res.status(500).json({ message: 'Erro ao buscar animal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }
        res.json(result[0]);  
    });
});

app.post('/animais', (req, res) => {
    const { nome, idade, tipo, clienteId } = req.body;
    db.query('INSERT INTO animais (nome, idade, tipo, cliente_id) VALUES (?, ?, ?, ?)', [nome, idade, tipo, clienteId], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, nome, idade, tipo, clienteId });
    });
});

app.put('/animais/:id', (req, res) => {
    const { nome, idade, tipo, clienteId } = req.body;
    const { id } = req.params;

    console.log(`Atualizando animal com ID: ${id}`);  
    console.log(req.body);  

    db.query(
        'UPDATE animais SET nome = ?, idade = ?, tipo = ?, cliente_id = ? WHERE id = ?',
        [nome, idade, tipo, clienteId, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar animal:', err);
                return res.status(500).json({ message: 'Erro ao atualizar animal' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Animal não encontrado' });
            }
            console.log(result);  
            res.json({ message: 'Animal atualizado com sucesso!', id, nome, idade, tipo, clienteId });
        }
    );
});

app.delete('/animais/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM animais WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir animal:', err);
            return res.status(500).json({ message: 'Erro ao excluir animal' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }

        res.json({ message: 'Animal excluído com sucesso!' });
    });
});

// ============================================================================== \\

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
