const basicInfo = require('./basicInfo');
const components = require('./components');
const tags = require('./tags');
const Instance = require('./Instance');
const Chat = require('./Chat');
const Group = require('./Group')


module.exports = {
    ...basicInfo,
    ...components,
    ...tags,
    "paths":{ 
        ...Instance,
        ...Chat,
        ...Group
    }
}