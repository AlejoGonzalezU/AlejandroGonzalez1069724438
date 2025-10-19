import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import routes from './src/routes/index.js';
import profileController from './src/controllers/profileController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(config));

app.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  res.locals.currentPage = req.path === "/" ? "home" : req.path.replace("/", "");  next();
});

console.log("🔍 Configurando rutas...");app.use('/', routes);

app.use(profileController.notFound);

app.use(profileController.error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: ${path.join(__dirname, 'public')}`);
});