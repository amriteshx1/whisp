import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('Whisp backend is whispering...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
