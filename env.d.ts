declare namespace NodeJS {
  interface ProcessEnv {
    NAME: string;
    HOST: string;
    SECRET_KEY: string;
    CORE_API_KEY: string;
    DEVICE_ID: string;
    AUTH_LOGIN_URL: string;
    CORE_URL: string;
    PUBLIC_CORE_URL: string;
    APP_API_HOST: string;
    APP_API_ORIGIN: string;
    V2_API_HOST: string;
  }
}
