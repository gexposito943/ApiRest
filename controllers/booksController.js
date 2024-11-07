import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const rutaArxiu = './models/books.json';

// Obtenir tots els llibres
const obtenirLlibres = (req, res) => {
    const { autor, titol } = req.query;
    let llibres = JSON.parse(fs.readFileSync(rutaArxiu));

    if (autor) {
        llibres = llibres.filter(llibre => 
            llibre.autor.toLowerCase().includes(autor.toLowerCase())
        );
    }

    if (titol) {
        llibres = llibres.filter(llibre => 
            llibre.titol.toLowerCase().includes(titol.toLowerCase())
        );
    }

    res.json(llibres);
};

const crearLlibre = (req, res) => {
    try {
        console.log('Inician la creación del llibre...'); 
        console.log('cos rebu:', req.body); 

        // llegir el contingut actual de l'arxiu
        const contenido = fs.readFileSync(rutaArxiu, 'utf8');
        console.log('Contingut actual:', contenido); 

        let data = JSON.parse(contenido);

        // crear un nou llibre
        const nouLlibre = {
            id: uuidv4(),
            details: req.body.details
        };

        console.log('Nou llibre a afegir:', nouLlibre); 

        // afegir el llibre a l'array de llibres
        data.books.push(nouLlibre);
        
        // actualitzar la data d'actualització
        data.updatedAt = new Date().toISOString();

        
        fs.writeFileSync(rutaArxiu, JSON.stringify(data, null, 2));

        res.status(201).json(nouLlibre);
    } catch (error) {
        console.error('Error complert:', error);
        console.error('Stack:', error.stack); 
        res.status(500).json({ 
            exit: false, 
            missatge: 'Error al crear el llibre',
            error: error.message,
            detalles: error.stack 
        });
    }
};

// Actualitzar un llibre
const actualitzarLlibre = (req, res) => {
    let llibres = JSON.parse(fs.readFileSync(rutaArxiu));
    const { id } = req.params;
    const indexLlibre = llibres.findIndex(llibre => llibre.id === id);
    
    if (indexLlibre === -1) {
        return res.status(404).json({ missatge: 'Llibre no trobat' });
    }

    llibres[indexLlibre] = { 
        ...llibres[indexLlibre], 
        ...req.body, 
        actualitzatEl: new Date().toISOString() 
    };
    fs.writeFileSync(rutaArxiu, JSON.stringify(llibres, null, 2));
    res.json(llibres[indexLlibre]);
};

// Eliminar un llibre
const eliminarLlibre = (req, res) => {
    try {
        // llegir el contingut actual de l'arxiu
        const contenido = fs.readFileSync(rutaArxiu, 'utf8');
        let data = JSON.parse(contenido);

        
        const { id } = req.params;

       
        const indexLlibre = data.books.findIndex(book => book.id === id);

        // Si no existeix el llibre
        if (indexLlibre === -1) {
            return res.status(404).json({
                success: false,
                message: 'Llibre no trobat'
            });
        }

        data.books.splice(indexLlibre, 1);
        
       
        data.updatedAt = new Date().toISOString();

        
        fs.writeFileSync(rutaArxiu, JSON.stringify(data, null, 2));

        
        res.status(200).json({
            success: true,
            message: 'Llibre eliminat correctament'
        });

    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        res.status(500).json({
            success: false,
            message: 'Error intern del servidor',
            error: error.message
        });
    }
};

const obtenirLlibreriesAmbStock = (req, res) => {
    try {
        const { id } = req.params;
        const { minCopies = 20 } = req.query;
        
        const llibres = JSON.parse(fs.readFileSync(rutaArxiu));
        const llibreries = JSON.parse(fs.readFileSync('./models/bookstores.json'));
        const vendes = JSON.parse(fs.readFileSync('./models/sales.json'));

        const llibre = llibres.find(l => l.id === id);
        if (!llibre) {
            return res.status(404).json({ missatge: 'Llibre no trobat' });
        }

        const llibreriesAmbStock = llibreries.filter(llibreria => {
            const vendesPerLlibreria = vendes.filter(
                venda => venda.llibreriaId === llibreria.id && venda.llibreId === id
            );
            const totalVenut = vendesPerLlibreria.reduce((sum, venda) => sum + venda.quantitat, 0);
            return totalVenut >= parseInt(minCopies);
        });

        res.json(llibreriesAmbStock);
    } catch (error) {
        res.status(500).json({ missatge: 'Error del servidor' });
    }
};

export { 
    obtenirLlibres as getBooks, 
    crearLlibre as createBook, 
    actualitzarLlibre as updateBook, 
    eliminarLlibre as deleteBook, 
    obtenirLlibreriesAmbStock as getBookstoresWithStock 
};
