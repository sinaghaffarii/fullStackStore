import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { productRoutes } from './infrastructure/http/routes/product.routes';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { setupSwagger } from './docs/swagger/setup';
import { sequelize } from './configs/database';
import { config } from './configs/environment';
import { notFoundHandler } from './infrastructure/http/middlewares/not-fount.middleware';
import { errorHandler } from './infrastructure/http/middlewares/error-handler.middleware';
import { setupAssociations } from './infrastructure/database/models';

class App {
  public app: express.Application;

  constructor() {
    console.log('🚀 Initializing application...');
    this.app = express();

    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();

    console.log('✅ Application initialized successfully');
  }

  private initializeMiddlewares(): void {
    console.log('🔄 Setting up middlewares...');
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('combined'));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
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
    } catch (error) {
      console.error('❌ Database error:', error);
      process.exit(1);
    }
  }

  private initializeRoutes(): void {
    console.log('🔄 Setting up routes...');

    this.app.get('/', (req, res) => {
      res.json({
        message: 'FullStack Store API',
        version: '1.0.0',
        docs: `/api-docs`,
        health: `/health`,
      });
    });

    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/products', productRoutes);

    console.log('✅ Routes setup completed');
  }

  private initializeErrorHandling(): void {
    console.log('🔄 Setting up error handling...');
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeSwagger(): void {
    console.log('🔄 Setting up Swagger...');
    try {
      setupSwagger(this.app);
      console.log('✅ Swagger setup completed');
    } catch (error) {
      console.error('❌ Swagger setup failed:', error);
    }
  }

  public listen(): void {
    this.app.listen(config.app.port, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`📍 Port: ${config.app.port}`);
      console.log(`📚 Docs: http://localhost:${config.app.port}/api-docs`);
      console.log(`📋 JSON: http://localhost:${config.app.port}/api-docs.json`);
      console.log(`🏥 Health: http://localhost:${config.app.port}/health`);
      console.log(`🔧 Environment: ${config.app.env}`);
    });
  }
}

// Start the application
console.log('🚀 Starting FullStack Store Backend...');
const app = new App();
app.listen();
