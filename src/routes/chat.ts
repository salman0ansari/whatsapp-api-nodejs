import express from "express";
import { text } from "../controller/chat.js";

const route = express.Router()

route.post('/text', text)

export default route as express.Router
