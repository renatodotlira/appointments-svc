import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

export type HttpServer = {
  TYPE: 'http' | 'https';
  PORT: number;
  URL: string;
  DISABLE_DOCS: boolean;
  DISABLE_MANAGER: boolean;
};

export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type Cors = {
  ORIGIN: string[];
  METHODS: HttpMethods[];
  CREDENTIALS: boolean;
};

export type LogBaileys = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LogLevel = 'ERROR' | 'WARN' | 'DEBUG' | 'INFO' | 'LOG' | 'VERBOSE' | 'DARK' | 'WEBHOOKS';

export type Log = {
  LEVEL: LogLevel[];
  COLOR: boolean;
  BAILEYS: LogBaileys;
};

export type SaveData = {
  INSTANCE: boolean;
  NEW_MESSAGE: boolean;
  MESSAGE_UPDATE: boolean;
  CONTACTS: boolean;
  CHATS: boolean;
  LABELS: boolean;
};

export type StoreConf = {
  MESSAGES: boolean;
  MESSAGE_UP: boolean;
  CONTACTS: boolean;
  CHATS: boolean;
  LABELS: boolean;
};

export type CleanStoreConf = {
  CLEANING_INTERVAL: number;
  MESSAGES: boolean;
  MESSAGE_UP: boolean;
  CONTACTS: boolean;
  CHATS: boolean;
};

export type DBConnection = {
  URI: string;
  DB_PREFIX_NAME: string;
};
export type Database = {
  HOST: string;
  USER: string;
  PASSWORD: string;
  DB_NAME: string
};

export type ApiKey = { KEY: string };
export type Jwt = { EXPIRIN_IN: number; SECRET: string };

export type Auth = {
  API_KEY: ApiKey;
  EXPOSE_IN_FETCH_INSTANCES: boolean;
  JWT: Jwt;
  TYPE: 'jwt' | 'apikey';
};

export type Language = string | 'en';

export type CacheConfRedis = {
  ENABLED: boolean;
  URI: string;
  PREFIX_KEY: string;
  TTL: number;
  SAVE_INSTANCES: boolean;
};
export type CacheConfLocal = {
  ENABLED: boolean;
  TTL: number;
};
export type SslConf = { PRIVKEY: string; FULLCHAIN: string };
export type QrCode = { LIMIT: number; COLOR: string };

export type Production = boolean;

export interface Env {
  SERVER: HttpServer;
  CORS: Cors;
  SSL_CONF: SslConf;
  DATABASE: Database;
  LOG: Log;
  LANGUAGE: Language;
  AUTHENTICATION: Auth;
  PRODUCTION?: Production;
}

export type Key = keyof Env;

export class ConfigService {
  constructor() {
    this.loadEnv();
  }

  private env: Env;

  public get<T = any>(key: Key) {
    return this.env[key] as T;
  }

  private loadEnv() {
    this.env = !(process.env?.DOCKER_ENV === 'true') ? this.envYaml() : this.envProcess();
    this.env.PRODUCTION = process.env?.NODE_ENV === 'PROD';
    if (process.env?.DOCKER_ENV === 'true') {
      this.env.SERVER.TYPE = process.env.SERVER_TYPE as 'http' | 'http';
      this.env.SERVER.PORT = Number.parseInt(process.env.SERVER_PORT) || 8083;
    }
  }

  private envYaml(): Env {
    return load(readFileSync(join(process.cwd(), 'src', 'env.yml'), { encoding: 'utf-8' })) as Env;
  }

  private envProcess(): Env {
    return {
      SERVER: {
        TYPE: (process.env.SERVER_TYPE as 'http' | 'https') || 'http',
        PORT: Number.parseInt(process.env.SERVER_PORT) || 8083,
        URL: process.env.SERVER_URL,
        DISABLE_DOCS: process.env?.SERVER_DISABLE_DOCS === 'true',
        DISABLE_MANAGER: process.env?.SERVER_DISABLE_MANAGER === 'true',
      },
      CORS: {
        ORIGIN: process.env.CORS_ORIGIN.split(',') || ['*'],
        METHODS: (process.env.CORS_METHODS.split(',') as HttpMethods[]) || ['POST', 'GET', 'PUT', 'DELETE'],
        CREDENTIALS: process.env?.CORS_CREDENTIALS === 'true',
      },
      SSL_CONF: {
        PRIVKEY: process.env?.SSL_CONF_PRIVKEY || '',
        FULLCHAIN: process.env?.SSL_CONF_FULLCHAIN || '',
      },
      DATABASE: {
        HOST: process.env.DATABASE_HOST,
        USER: process.env.DATABASE_USER,
        PASSWORD:process.env.DATABASE_PASSWORD,
        DB_NAME: process.env.DATABASE_NAME
      },
      LOG: {
        LEVEL: (process.env?.LOG_LEVEL.split(',') as LogLevel[]) || [
          'ERROR',
          'WARN',
          'DEBUG',
          'INFO',
          'LOG',
          'VERBOSE',
          'DARK',
          'WEBHOOKS',
        ],
        COLOR: process.env?.LOG_COLOR === 'true',
        BAILEYS: (process.env?.LOG_BAILEYS as LogBaileys) || 'error',
      },
      LANGUAGE: process.env?.LANGUAGE || 'en',
      AUTHENTICATION: {
        TYPE: process.env.AUTHENTICATION_TYPE as 'apikey',
        API_KEY: {
          KEY: process.env.AUTHENTICATION_API_KEY || 'BQYHJGJHJ',
        },
        EXPOSE_IN_FETCH_INSTANCES: process.env?.AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES === 'true',
        JWT: {
          EXPIRIN_IN: Number.isInteger(process.env?.AUTHENTICATION_JWT_EXPIRIN_IN)
            ? Number.parseInt(process.env.AUTHENTICATION_JWT_EXPIRIN_IN)
            : 3600,
          SECRET: process.env.AUTHENTICATION_JWT_SECRET || 'L=0YWt]b2w[WF>#>:&E`',
        },
      },
    };
  }
}

export const configService = new ConfigService();
