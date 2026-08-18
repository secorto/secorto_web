import path from 'node:path'
import { fileURLToPath } from 'url'
import { runAndExit } from './wait-netlify.js'

const thisFile = fileURLToPath(import.meta.url)
const argv1 = process.argv[1]

if (argv1 && path.resolve(argv1) === thisFile) runAndExit()
