/*
 * SET UP EXPRESS SERVER
 */

import "dotenv/config";
import app from "./app";
import { env } from "./config";

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Cinebase server is running on port ${PORT}`);
});