import express from 'express';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes (API endpoints)
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

//Server starting
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});