import app from './app';
import { prisma } from './db/client';
import { getEnvConfig } from './utils/env';

async function startServer() {
  try {
    // Validate environment variables first
    const config = getEnvConfig();
    console.log(`🔧 Environment: ${config.NODE_ENV}`);
    console.log(`🔐 JWT Secret: ${config.JWT_SECRET.substring(0, 8)}...`);

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
      console.log(`🔧 Setup complete`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
