import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

export function setupSwagger(app: Application): void {
  console.log('🎯 Setting up Swagger documentation...');

  try {
    const swaggerSpec = buildSwaggerSpec();

    // Swagger UI Route - این مهمه!
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Raw JSON endpoint
    app.get('/api-docs.json', (req, res) => {
      res.json(swaggerSpec);
    });

    console.log('✅ Swagger routes registered:');
    console.log('   📚 UI: /api-docs');
    console.log('   📋 JSON: /api-docs.json');
  } catch (error) {
    console.error('❌ Swagger setup error:', error);
    setupBasicSwagger(app);
  }
}

function buildSwaggerSpec() {
  const baseSpec = {
    openapi: '3.0.0',
    info: {
      title: 'FullStack Store API',
      version: '1.0.0',
      description:
        'Complete e-commerce API with authentication and product management',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {},
  };

  const yamlFiles = loadYamlFiles();
  return yamlFiles.reduce(
    (spec, yamlContent) => mergeSpecs(spec, yamlContent),
    baseSpec,
  );
}

function loadYamlFiles() {
  const specsDir = __dirname;
  const yamlFiles = ['auth.yaml', 'product.yaml'];

  return yamlFiles.map((file) => {
    const filePath = path.join(specsDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return {};
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return YAML.parse(content);
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error);
      return {};
    }
  });
}

function mergeSpecs(target: any, source: any) {
  if (!source || Object.keys(source).length === 0) return target;

  return {
    ...target,
    paths: { ...target.paths, ...source.paths },
    components: {
      ...target.components,
      ...source.components,
      schemas: { ...target.components?.schemas, ...source.components?.schemas },
      securitySchemes: {
        ...target.components?.securitySchemes,
        ...source.components?.securitySchemes,
      },
    },
    tags: [...(target.tags || []), ...(source.tags || [])],
  };
}

// Fallback function
function setupBasicSwagger(app: Application): void {
  console.log('🔄 Setting up basic Swagger fallback...');

  const basicSpec = {
    openapi: '3.0.0',
    info: {
      title: 'FullStack Store API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    paths: {
      '/health': {
        get: {
          summary: 'Health Check',
          responses: { '200': { description: 'OK' } },
        },
      },
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(basicSpec));
  console.log('✅ Basic Swagger fallback setup completed');
}
