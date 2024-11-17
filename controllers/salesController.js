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

const eliminarVenda = (req, res) => {
    try {
        
        const contenido = fs.readFileSync(rutaArxiu, 'utf8');
        let data = JSON.parse(contenido);

        
        const { id } = req.params;
        const ventasActualizadas = data.sales.filter(sale => sale.id !== id);

        // Verificar si se encontró la venta
        if (ventasActualizadas.length === data.sales.length) {
            return res.status(404).json({
                success: false,
                message: 'Venda no trobada'
            });
        }

        // Actualizar datos
        data.sales = ventasActualizadas;
        data.updatedAt = new Date().toISOString();

        // Guardar cambios
        fs.writeFileSync(rutaArxiu, JSON.stringify(data, null, 2));

        res.status(200).json({
            success: true,
            message: 'Venda eliminada correctament'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error intern del servidor',
            error: error.message
        });
    }
};

export { 
    crearVenda as createSale,
    eliminarVenda as deleteSale 
};
