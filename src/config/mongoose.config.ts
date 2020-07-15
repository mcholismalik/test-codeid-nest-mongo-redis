import * as config from 'config'

const dbConfig = config.get('db')
export const mongooseConfig = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@cluster0.ysiah.mongodb.net/${dbConfig.database}?retryWrites=true&w=majority`
