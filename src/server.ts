import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('DB:', {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
  });
  console.log(`🚀 Servidor corriendo en puerto 1555 ${PORT}`);
});

//new ports example
