"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send("Welcome");
});
exports.default = app;
//# sourceMappingURL=app.js.map