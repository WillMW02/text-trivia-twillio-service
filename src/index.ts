import 'dotenv/config';
import app from './app.js';

/*
  Get port from environment variable or default to 3000
  Set up our program constants
*/
const port = process.env.PORT || 3000;

/*
  Begin listening for connections
*/
const server = app.listen(port);
console.debug('Started server successfully');
console.debug(`Connect via http://127.0.0.1:${port}`);

/*
  Cleanup utility function
*/
async function cleanup() {
    console.debug('Server closing...');

    server.close((err: unknown) => {
        if (err) throw err;
    });
}

/*
  Handle SIGINTs cleanly (e.g. ctrl-C / cmd-C)
*/
process.on('SIGINT', async () => {
    console.debug('SIGINT: Shutting down cleanly');
    try {
        await cleanup();
        process.exit(0);
    } catch {
        process.exit(1);
    }
});
