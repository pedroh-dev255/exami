const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// middlewares
const authMiddleware = require("./middlewares/authMiddleware");
const logMiddleware = require("./middlewares/logginMiddleware");




const app = express();

app.use(cors());

app.use(helmet());
app.use(compression());
app.use(express.json({
    limit: "100mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));
app.use(logMiddleware);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Exami API"
    });
});

// Rotas


app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Endpoint não encontrado."
    });
});

app.use((err, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: err.message
    });

});

module.exports = app;