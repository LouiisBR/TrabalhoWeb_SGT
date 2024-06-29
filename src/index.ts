import express from "express";
import router from "./routes/index.routes";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3333;

const corsOptions: cors.CorsOptions = {
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
};
  
app.use(cors());

app.use(express.json());

app.use(router);

app.listen(port, () =>{
    console.log(`API rodando na porta ${port}, criada por 
    \n  Luis Antônio Gambatti Junior (CT3010864)
    \n  Victor Gabriel Oliveira Vidal (CT3014274)
    \n  Leonardo Dias Lieira (CT3014517)`);
});