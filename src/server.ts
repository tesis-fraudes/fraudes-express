import app from './app';

console.log('🚨 TODAS LAS ENV DISPONIBLES:', JSON.stringify(process.env, null, 2));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

//new ports example
