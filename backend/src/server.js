const env = require("./config/env");
const app = require("./app");

app.listen(env.port, () => console.log(`Gombisa API running on port ${env.port}`));
