const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
     
        jwt({ secret, algorithms: ['HS256'] }),

       
        async (req, res, next) => {
            const account = await db.Account.findByPk(req.user.id);
            
            if (!account || (roles.length && !roles.includes(account.role))) {
             
                return res.status(401).json({ message: 'Unauthorized' });
            }

           
            req.user.role = account.role;
            const employee = await db.Employee.findOne({ where: { userId: account.id } });
            if (employee) {
                req.user.employeeId = employee.id;
            }
            const refreshTokens = await db.RefreshToken.findAll({ where: { accountId: account.id } });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}