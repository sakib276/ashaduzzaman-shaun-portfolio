import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Portfolio Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - GET  http://localhost:${PORT}/api/portfolio`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - GET  http://localhost:${PORT}/api/health`);
  });
}

startServer();
