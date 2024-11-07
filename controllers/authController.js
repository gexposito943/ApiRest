import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const arxiuUsuaris = './models/users.json';

export const registrar = async (req, res) => {
    try {
        const { nomUsuari, contrasenya } = req.body;
        
        // Llegir usuaris existents
        let usuaris = [];
        try {
            const dades = await fs.readFile(arxiuUsuaris, 'utf8');
            usuaris = JSON.parse(dades);
        } catch (error) {
            await fs.writeFile(arxiuUsuaris, '[]');
        }
        
        // Verificar si l'usuari ja existeix
        if (usuaris.find(usuari => usuari.nomUsuari === nomUsuari)) {
            return res.status(400).json({ 
                exit: false, 
                missatge: 'L\'usuari ja existeix' 
            });
        }

        // Encriptar contrasenya
        const salt = await bcrypt.genSalt(10);
        const contrasenyaEncriptada = await bcrypt.hash(contrasenya, salt);

        // Crear nou usuari
        const nouUsuari = {
            id: uuidv4(),
            nomUsuari,
            contrasenya: contrasenyaEncriptada,
            creatEl: new Date().toISOString(),
            actualitzatEl: new Date().toISOString()
        };

        usuaris.push(nouUsuari);
        await fs.writeFile(arxiuUsuaris, JSON.stringify(usuaris, null));

        // Generar JWT
        const carrega = {
            usuari: {
                id: nouUsuari.id
            }
        };

        jwt.sign(
            carrega, 
            'clau_secreta_jwt',
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ exit: true, token });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            exit: false, 
            missatge: 'Error en el  servidor' 
        });
    }
};

// Iniciar sessió
export const login = async (req, res) => {
    try {
        const { nomUsuari, contrasenya } = req.body;
        
        // Llegir usuaris
        const dades = await fs.readFile(arxiuUsuaris, 'utf8');
        const usuaris = JSON.parse(dades);
        
        // Buscar usuari
        const usuari = usuaris.find(u => u.nomUsuari === nomUsuari);
        if (!usuari) {
            return res.status(400).json({ 
                exit: false, 
                missatge: 'Credencials invàlides' 
            });
        }

        // Verificar contrasenya
        const esCorrecte = await bcrypt.compare(contrasenya, usuari.contrasenya);
        if (!esCorrecte) {
            return res.status(400).json({ 
                exit: false, 
                missatge: 'Credencials invàlides' 
            });
        }

        // Generar JWT
        const carrega = {
            usuari: {
                id: usuari.id
            }
        };

        jwt.sign(
            carrega, 
            'clau_secreta_jwt',
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ exit: true, token });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            exit: false, 
            missatge: 'Error en el servidor' 
        });
    }
}; 