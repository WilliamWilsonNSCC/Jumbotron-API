import express from 'express';

const router = express.Router();

//Get: /api/events/
app.get('/', (req, res) => {
  const events = [
    {id: 1, title: 'Concert', description:'Live concerts'},
    {id: 2, title: 'Live Events', description:'Live events (sports, wrestling)'},
    {id: 3, title: 'Social Events',description: 'Social events from comi-cons to job fairs'},
  ];

  res.json(events);
});

//Get: /api/events/:Id
app.get('/:id', (req, res) => {
  const id = req.params.id;
  //createa a sample photo object
  const events = {id: id, title: title, description: description};

  res.json(events);
});

export default router;