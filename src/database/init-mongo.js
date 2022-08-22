const { MongoClient } = require('mongodb');

console.log('#> init-mongo-CI.js: started');
main().catch(console.error);

async function main() {
    const uri = 'mongodb+srv://yago:58594402@tmc.joajvwu.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'tooManyClass';
    console.log(`#> Connecting to "${uri.split('@')[1]}"`);
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await configureDatabase(client.db(dbName));
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    } finally {
        await client.close();
    }
}
async function configureDatabase(db) {
    await db.collection('_configs').insertOne({
        _id: '1',
        dbVersion: 1
    });
}

// db.getCollection('_configs').insertOne({
//   _id: '1',
//   dbVersion: 1,
// });
// mongodb://admin:123-dev-server-321@127.0.0.1:27017/tooManyClass?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
