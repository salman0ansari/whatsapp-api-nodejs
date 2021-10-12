const init = require('./init');
const restore = require('./restore');
const qrcode = require('./qrcode');
const instance = require('./instance');
const logout = require('./logout');
const remove = require('./delete');

module.exports = {
    
        '/init':{
            ...init
        },
        '/restore':{
            ...restore
        },
        '/qrcode': {
            ...qrcode
        },
        '/instance':{
            ...instance
        },
        '/logout':{
            ...logout
        },
        '/delete':{
            ...remove
    
}};