import express from 'express';
import sql from 'mssql';
import 'dotenv/config';

const router = express.Router();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

//Get: /api/events/
router.get('/', async (req, res) => {

  await sql.connect(dbConnectionString);
  
  const result = await sql.query`SELECT a.[ShowId], a.[Title], a.[Description], 
  a.[Location], a.[Creator], a.[Filename], a.[Date], a.[Date], b.[CategoryId], b.[Title]
  from [dbo].[Show] a
  INNER JOIN [dbo].[Category] b
  ON a.[CategoryId] = b.[CategoryId]
  ORDER BY a.[Date] ASC`;

  // console.dir(result);


  //return the results as json
  res.json(result.recordset);
});

//Get: /api/events/:Id
router.get('/:id', (req, res) => {
  const id = req.params.id;

  //create a sample photo object
  const events = {id: id, title: 'title', description: 'description'};

  res.json(events);
});

export default router;