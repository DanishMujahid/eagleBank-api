/**
 * Environment variable validation utility
 * Ensures all required environment variables are set and valid
 */

interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

/**
 * Validate and return environment configuration
 * @throws Error if required environment variables are missing or invalid
 */
export const validateEnvironment = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  };

  // Validate NODE_ENV
  if (!['development', 'test', 'production'].includes(config.NODE_ENV)) {
    throw new Error(
      `Invalid NODE_ENV: ${config.NODE_ENV}. Must be development, test, or production`
    );
  }

  // Validate PORT
  if (isNaN(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    throw new Error(
      `Invalid PORT: ${config.PORT}. Must be a number between 1 and 65535`
    );
  }

  // Validate DATABASE_URL
  if (!config.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Validate JWT_SECRET
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  // In production, ensure JWT_SECRET is strong
  if (config.NODE_ENV === 'production') {
    if (config.JWT_SECRET.length < 32) {
      throw new Error(
        'JWT_SECRET must be at least 32 characters long in production'
      );
    }

    if (
      config.JWT_SECRET === 'fallback-secret' ||
      config.JWT_SECRET === 'your-secret-key' ||
      config.JWT_SECRET === 'secret'
    ) {
      throw new Error(
        'JWT_SECRET cannot use default/example values in production'
      );
    }

    // Check for common weak patterns
    const weakPatterns = ['password', '123456', 'qwerty', 'admin', 'test'];
    if (
      weakPatterns.some(pattern =>
        config.JWT_SECRET.toLowerCase().includes(pattern)
      )
    ) {
      throw new Error(
        'JWT_SECRET contains weak patterns and is not secure for production'
      );
    }
  }

  // Validate JWT_EXPIRES_IN
  const validExpiryFormats = /^\d+[smhd]$/;
  if (!validExpiryFormats.test(config.JWT_EXPIRES_IN)) {
    throw new Error(
      `Invalid JWT_EXPIRES_IN: ${config.JWT_EXPIRES_IN}. Must be in format: 30s, 5m, 2h, 1d`
    );
  }

  return config;
};

/**
 * Get environment configuration (validated)
 */
export const getEnvConfig = (): EnvironmentConfig => {
  return validateEnvironment();
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if running in test environment
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};
