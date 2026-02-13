import type { Application } from 'express';

import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers: { url: string }[];
  tags?: any[];
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
}

const YAML_FILES = [
  'auth.yaml',
  'upload.yaml',
  'brand.yaml',
  'category.yaml',
  'product.yaml',
  'cart.yaml',
  'discount.yaml',
];

export function setupSwagger(app: Application): void {
  const spec = buildSwaggerSpec();

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'FullStack Store API',
    }),
  );

  app.get('/api-docs.json', (_, res) => res.json(spec));
}

function buildSwaggerSpec(): OpenApiSpec {
  const baseSpec: OpenApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'FullStack Store API',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {},
    },
    tags: [],
  };

  for (const file of YAML_FILES) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    const yamlDoc = YAML.parse(fs.readFileSync(filePath, 'utf8'));

    for (const [pathKey, pathValue] of Object.entries(yamlDoc.paths || {})) {
      if (!baseSpec.paths[pathKey]) {
        baseSpec.paths[pathKey] = pathValue;
      } else {
        Object.assign(baseSpec.paths[pathKey], pathValue);
      }
    }

    if (yamlDoc.components?.schemas) {
      Object.assign(baseSpec.components!.schemas!, yamlDoc.components.schemas);
    }

    if (yamlDoc.components?.securitySchemes) {
      Object.assign(
        baseSpec.components!.securitySchemes!,
        yamlDoc.components.securitySchemes,
      );
    }

    if (yamlDoc.tags) {
      baseSpec.tags!.push(...yamlDoc.tags);
    }
  }

  return baseSpec;
}
