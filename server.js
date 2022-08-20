import clc from "cli-color";

import app from "./app.js";
import { databaseConnection } from "./database/session/index.js";

const PORT = process.env.PORT || 3001;

try {
	(async () => await databaseConnection())();

	console.log(clc.bgGreen("successfully connected"));
} catch (err) {
	console.log(clc.bgRed(err.message));

	console.log(clc.bgRed("not connected"));
}

app.listen(PORT, () => {
	console.log(clc.bgBlue(`app running on port ${PORT}`));
});
