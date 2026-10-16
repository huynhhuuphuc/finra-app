**Framework Environment**:

node: <mark>24.13.0</mark>

yarn: <mark>1.22.22</mark>

# Directory Structure

```
umi-admins
.
├── .husky                    # Git commit conventions
├── .config                   # Configuration files
│   ├── config.development.ts # Development environment
│   ├── config.production.ts  # Production environment
│   ├── config.qa.ts          # QA/Test environment
│   ├── config.ts             # Unified configuration
│   ├── defaultSettings.ts    # Default settings
│	└── routes.ts             # Route configuration
├── mock
│	└── apis.ts               # Mock data; simulate backend during early development
├── public                    # Contents are copied to the root at build time
├── src                       # Source code
│   ├── api                   # Client-server interactions
│   │   ├── apiConfig         # axios wrapper: request/response interceptors, unified error handling
│   │   └── apiServer         # Business API definitions, naming: apiXXX, exported in index.ts
│   │   │   ├── typings.d.ts  # Unified TypeScript types for APIs
│   │   │   └── ....
│   ├── assets                # Static assets
│   ├── components            # Global components
│   │   ├── @lgs              # Common self-encapsulated components
│   │   └── ....              # Project-wide shared components
│   ├── constants             # Global constants
│   ├── hooks                 # Hooks
│   ├── models                # State management
│   ├── pages                 # Business pages
│   ├── utils                 # Utilities
│   ├── access.ts             # Permission management
│   ├── app.tsx               # Global configuration: Layout...
│   ├── global.less           # Global styles
│   ├── global.tsx            # Global scripts
│   ├── .env                  # Environment variables (PORT/HOST for local dev domain)
│   └── .env.d.ts             # Env var type declarations for variables defined in config.xxx.ts
└── ...                       # Misc configuration files
```
# Backend-Frontend Interaction Conventions

Response data types

```ts
// -- Basic response structure
export interface AxiosResult<T = any> {
  /** Status code */
  code: number;
  /** Response data */
  data: T;
  /** Message */
  msg: string;
}

// -- List response structure
interface List<T> {
  /** List data */
  data: T[];
  /** Current page */
  current: number;
  /** Page size */
  pageSize: number;
  /** Total count */
  total: number;
}

const response: AxiosResult<List<T>>;

// -- List request
interface ListParams {
  /** Current page */
  current?: number;
  /** Page size */
  pageSize?: number;
  /** Other filter properties */
  [__prop__: string]: any;
}
```

It's use RESTful APIs. Using goods as an example:

```ts
// 1. Create a product
POST /api/banner
```

# Troubleshooting

## 1. git commit conventions

On macOS, when you run git commit, the commit conventions may not be validated, and the console shows:

```shell
hint: The '.husky/pre-commit' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
hint: The '.husky/commit-msg' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
```

Solution → Run the following command in the terminal:

```shell
$ chmod 777 .husky/*
```

Submitting again will trigger the git commit convention checks.
