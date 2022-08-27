import clc from "cli-color";

import app from "./app";
import { databaseConnection } from "./database/session/index";

const PORT = process.env.PORT || 3001;

try {
    (async () => await databaseConnection())();

    console.log(clc.white.bgGreen("successfully connected"));
} catch (err) {
    console.log(clc.red.bgRedBright(err.message));

    console.log(clc.red.bgRedBright("not connected"));
}

app.listen(PORT, () => {
    console.log(clc.white.bgBlue(`app running on port ${PORT}`));
});
