const basicInfo = require('./basicInfo');
const components = require('./components');
const tags = require('./tags');
const Instance = require('./Instance');
const Chat = require('./Chat');


module.exports = {
    ...basicInfo,
    ...components,
    ...tags,
    "paths":{ 
        ...Instance,
        ...Chat 
    }
}