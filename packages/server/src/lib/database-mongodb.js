import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connected = false;
    this.connect = this.connect.bind(this);
  }

  /**
   * Connects to the database
   *
   * @param {Boolean} lambda Whether or not deploying to aws lambda
   */
  connect(lambda = false) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        return resolve();
      }

      console.log('Connecting to database...');

      const config = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        keepAlive: true
      };

      if (lambda) {
        config.bufferCommands = false; // Disable mongoose buffering
        config.bufferMaxEntries = 0; // and MongoDB driver buffering
      }

      mongoose.connect(process.env.DB_URL, config);
      mongoose.connection.on('error', (err) => {
        console.error('connection error:', err);
        reject(err);
      });
      mongoose.connection.once('open', () => {
        this.connected = true;
        resolve();
      });
    });
  }
}

export default new Database();
