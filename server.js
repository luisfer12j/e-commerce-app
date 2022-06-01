const { app } = require('./app');
const { initModels } = require('./models/initModels');
const { db } = require('./utils/database');

db.authenticate()
    .then(() => console.log('Database authenticated successfully'))
    .catch(error => console.log(error));

initModels();

db.sync()
    .then(() => console.log('Database synced successfully'))
    .catch(error => console.log(error));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Express app running in port: ${PORT}`);
});