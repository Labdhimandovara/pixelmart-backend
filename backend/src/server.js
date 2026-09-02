const app = require('./app');

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`\n🎮 PixelMart API running on port ${PORT}`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health:    http://localhost:${PORT}/health\n`);
});
