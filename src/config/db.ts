import {Pool} from 'pg'

import { config as dotenvConfig } from 'dotenv';
dotenvConfig()

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

export default db

