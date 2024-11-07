import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'clau_secreta_jwt',
    arxiusDades: {
        usuaris: './models/users.json',
        llibres: './models/books.json',
        llibreries: './models/bookstores.json',
        vendes: './models/sales.json'
    }
};

export default config;
