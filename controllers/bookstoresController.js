import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const rutaArxiu = './models/bookstores.json';


const crearLlibreria = (req, res) => {
    try {
        
        const contenido = fs.readFileSync(rutaArxiu, 'utf8');
        let data = JSON.parse(contenido);

        
        const novaLlibreria = {
            id: uuidv4(),
            name: req.body.name,
            location: req.body.location,
            contact: {
                phone: req.body.contact.phone,
                email: req.body.contact.email
            },
            inventory: []  
        };

        
        data.bookstores.push(novaLlibreria);
        
    
        data.updatedAt = new Date().toISOString();

       
        fs.writeFileSync(rutaArxiu, JSON.stringify(data, null, 2));

        res.status(201).json(novaLlibreria);
    } catch (error) {
        console.error('Error en la creacio de la llibreria', error);
        res.status(500).json({ 
            exit: false, 
            missatge: 'Error en la creacio de la llibreria',
            error: error.message 
        });
    }
};

export { crearLlibreria as createBookstore };
