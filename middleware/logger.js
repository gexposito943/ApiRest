import fs from 'fs';
import { format } from 'date-fns';

export const logRequest = (req, res, next) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const log = `[${timestamp}] ${req.method} ${req.url}\n`;
    
    fs.appendFile('server.log', log, (err) => {
        if (err) console.error('Error escrivint en l\'arxiu de log:', err);
    });
    
    next();
}; 