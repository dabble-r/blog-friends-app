import app from './server.js'
import { PORT } from "./utils/config.js"

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})