import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('x-auth-token') || req.query['x-auth-token'];

    if (!token) {
        return res.status(401).json({ 
            exit: false, 
            missatge: 'No hi ha token, autorització denegada' 
        });
    }

    try {
        const decodificat = jwt.verify(token, 'clau_secreta_jwt');
        req.usuari = decodificat.usuari;
        next();
    } catch (err) {
        res.status(401).json({ 
            exit: false, 
            missatge: 'Token no vàlid' 
        });
    }
};

export default auth;