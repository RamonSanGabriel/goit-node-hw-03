// const app = require("./app");
import { app } from './app.js';

// http://localhost:3000/api/contacts/
app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
