import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const rutaArxiu = './models/sales.json';


const crearVenda = (req, res) => {
    try {
        // Leer el archivo actual
        const contenido = fs.readFileSync(rutaArxiu, 'utf8');
        let data = JSON.parse(contenido);

    
        const novaVenda = {
            id: uuidv4(),
            bookstoreId: req.body.bookstoreId,
            saleDate: req.body.saleDate,
            books: req.body.books
        };

        
        data.sales.push(novaVenda);
        
        
        data.updatedAt = new Date().toISOString();

       
        fs.writeFileSync(rutaArxiu, JSON.stringify(data, null, 2));

        res.status(201).json(novaVenda);
    } catch (error) {
        console.error('Error el creacio de vendes:', error);
        res.status(500).json({ 
            exit: false, 
            missatge: 'Error en creacio de vendes',
            error: error.message 
        });
    }
};

export { crearVenda as createSale };
