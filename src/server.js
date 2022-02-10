const app = require('./config/express');
const port = 3333

app.listen(port, () => console.log(`server started on port ${port}`));

module.exports = app;
