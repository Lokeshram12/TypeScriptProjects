import { NotFoundError } from "./errorHandler.js";
export async function handlerChirpsValidate(req, res) {
    const paramsBody = req.body;
    // Validate that the request has the expected shape
    if (!paramsBody || typeof paramsBody.body !== "string") {
        const err = new Error("Missing or invalid 'body' in request");
        err.statusCode = 400;
        throw err;
    }
    const maxChirpLength = 140;
    if (paramsBody.body.length > maxChirpLength) {
        throw new NotFoundError("Chirp is too long. Max length is 140");
    }
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const text = paramsBody.body;
    // Split into words by space
    const words = text.split(" ");
    const cleanedWords = words.map(word => {
        // Check profanity using lowercase comparison
        if (profaneWords.includes(word.toLowerCase())) {
            return "****";
        }
        return word;
    });
    const cleanedBody = cleanedWords.join(" ");
    return res.status(200).json({ cleanedBody });
}
