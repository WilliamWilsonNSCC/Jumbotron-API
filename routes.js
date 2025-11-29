import express from 'express';
import sql from 'mssql';
import 'dotenv/config';
import cors from 'cors';

const router = express.Router();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

router.use(cors());

//Get: /api/shows/
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
router.get('/:id', async (req, res) => {
  
  const id = req.params.id;

  if(isNaN(id)) {
    res.status(400).send('Invalid photo ID.');
    return;
  }

  await sql.connect(dbConnectionString);
    
  const result = await sql.query`SELECT a.[ShowId], a.[Title], a.[Description], 
  a.[Location], a.[Creator], a.[Filename], a.[Date], a.[CreateDate], 
  b.[CategoryId], b.[Title] as CategoryTitle
  FROM [dbo].[Show] a
  INNER JOIN [dbo].[Category] b
  ON a.[CategoryId] = b.[CategoryId]
  WHERE a.[ShowId] = ${id}`;


  // return the results as json
  if(result.recordset.length === 0) {
    res.status(404).json({ message: 'Photo not found.'});        
  }
  else {
    res.json(result.recordset[0]); // only return the first row (should always be the case)
  }
});

router.post('/:id/purchases', async (req, res) => {

    const showId = parseInt(req.params.id);
    const { ticketSales, name, email, paymentType, cardNumber, cvv} = req.body;

    await sql.connect(dbConnectionString);

    const result = await sql.query`
      INSERT INTO [dbo].[Purchase] 
      (ShowId, TicketSales, Name, Email, PaymentType, CardNumber, CVV)
      VALUES 
      (${showId}, ${ticketSales}, ${name}, ${email}, ${paymentType}, ${cardNumber}, ${cvv})
      SELECT SCOPE_IDENTITY() AS PurchaseId`;
    
    const purchaseId = result.recordset[0].PurchaseId;

    res.status(201).json({ 
      message: 'Purchase created successfully',
      purchaseId: purchaseId,
      showId: showId,
      ticketSales: ticketSales,
      name: name,
      email: email,
      paymentType: paymentType,
      cardNumber: cardNumber,
      cvv: cvv
    });

});

//GET: /api/events/:id/purchases - Get all purchases for a specific event
router.get('/:id/purchases', async (req, res) => {

    const showId = parseInt(req.params.id);

    await sql.connect(dbConnectionString);
    
    const showCheck = await sql.query`SELECT ShowId FROM [dbo].[Show] WHERE ShowId = ${showId}`;

    const result = await sql.query`
      SELECT PurchaseId, ShowId, TicketSales, Name, Email, PaymentType
      FROM [dbo].[Purchase]
      WHERE ShowId = ${showId}
      ORDER BY PurchaseId DESC`;
    
    res.json({
      showId: showId,
      totalPurchases: result.recordset.length,
      purchases: result.recordset
    });
});

export default router;