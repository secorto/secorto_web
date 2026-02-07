import { fileURLToPath } from 'url'
import { runAndExit } from './wait-netlify.js'

if (process.argv[1] === fileURLToPath(import.meta.url)) runAndExit()
