import 'module-alias/register'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

MongoHelper.connect('mongodb://127.0.0.1:35971/')
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(5000, () => {
      console.log('Server running at http://localhost/5000')
    })
  })
  .catch(console.error)
