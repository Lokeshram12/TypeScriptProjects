import express from "express";
import { Request, Response ,NextFunction} from "express";
import { config } from "./config.js";
const app = express();
const PORT = 8080;

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits++;
    next();
}

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc,express.static("./src/app"));

app.get("/healthz", (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
});

app.get("/metrics", (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${config.fileserverHits}`);
});

app.get("/reset", (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("Hits reset to 0");
});


app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}/`);
});

