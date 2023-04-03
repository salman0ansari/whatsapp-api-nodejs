import express from "express";
import { init, qr, restore } from '../controller/instance.js';

const route = express.Router()

route.post('/init', init)
route.get('/qr', qr)
route.get('/restore', restore)

export default route as express.Router