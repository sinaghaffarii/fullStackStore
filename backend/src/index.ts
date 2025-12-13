import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { sequelize } from './configs/database';
import { config } from './configs/environment';
import { seedAdmin } from './core/scripts/admin.seeder';
import { setupSwagger } from './docs/swagger/setup';
import { setupAssociations } from './infrastructure/database/models';
import { errorHandler } from './infrastructure/http/middlewares/error-handler.middleware';
import { notFoundHandler } from './infrastructure/http/middlewares/not-fount.middleware';
import { globalRateLimit } from './infrastructure/http/middlewares/rate-limit.middleware';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { brandRoutes } from './infrastructure/http/routes/brand.routes';
import { cartRoutes } from './infrastructure/http/routes/cart.routes';
import { categoryRoutes } from './infrastructure/http/routes/category.routes';
import { discountRoutes } from './infrastructure/http/routes/discount.routes';
import { productRoutes } from './infrastructure/http/routes/product.routes';
import { profileRoutes } from './infrastructure/http/routes/profile.routes';
import { CleanupService } from './shared/utils/cleanup';

class App {
  public app: express.Application;
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    console.log('🚀 Initializing application...');
    this.app = express();

    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();

    console.log('✅ Application initialized successfully');
  }

  public listen(): void {
    this.app.listen(config.app.port, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`📍 Port: ${config.app.port}`);
      console.log(`📚 Docs: http://localhost:${config.app.port}/api-docs`);
      console.log(`🔧 Environment: ${config.app.env}`);
    });
  }

  public async shutdown(): Promise<void> {
    console.log('\n🛑 Shutting down...');
    if (this.cleanupInterval) {
      CleanupService.stopAutoCleanup(this.cleanupInterval);
    }
    await sequelize.close();
    console.log('✅ Database connection closed');
  }

  public async start(): Promise<void> {
    await this.initializeDatabase();
    this.listen();
    this.startCleanupJob();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      console.log('🔄 Connecting to database...');
      await sequelize.authenticate();
      console.log('✅ Database connected');

      setupAssociations();

      if (config.app.env === 'development') {
        console.log('🔄 Syncing database...');
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ Database synced');
      }

      await seedAdmin();
    } catch (error) {
      console.error('❌ Database error:', error);
      process.exit(1);
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeMiddlewares(): void {
    console.log('🔄 Setting up middlewares...');

    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin:
          config.app.env === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || []
            : true,
        credentials: true,
      }),
    );

    // ⭐ Global Rate Limit - اعمال روی همه درخواست‌ها
    this.app.use(globalRateLimit);

    // Other middlewares
    this.app.use(compression());
    this.app.use(morgan(config.app.env === 'production' ? 'combined' : 'dev'));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(): void {
    console.log('🔄 Setting up routes...');

    this.app.get('/', (_req, res) => {
      res.json({
        message: 'FullStack Store API',
        version: '1.0.0',
        docs: `/api-docs`,
        health: `/health`,
      });
    });

    this.app.get('/health', async (_req, res) => {
      try {
        await sequelize.authenticate();
        res.json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          database: 'connected',
        });
      } catch {
        res.status(503).json({
          status: 'ERROR',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
        });
      }
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/profile', profileRoutes);

    this.app.use('/api/products', productRoutes);
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/brands', brandRoutes);
    this.app.use('/api/cart', cartRoutes);
    this.app.use('/api/discounts', discountRoutes);

    console.log('✅ Routes setup completed');
  }

  private initializeSwagger(): void {
    try {
      setupSwagger(this.app);
      console.log('✅ Swagger setup completed');
    } catch (error) {
      console.error('❌ Swagger setup failed:', error);
    }
  }

  private startCleanupJob(): void {
    this.cleanupInterval = CleanupService.startAutoCleanup(30);
  }
}

// Start
console.log('🚀 Starting FullStack Store Backend...');
const app = new App();

app.start().catch((error) => {
  console.error('❌ Failed to start:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await app.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await app.shutdown();
  process.exit(0);
});
