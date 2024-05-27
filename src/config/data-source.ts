import "reflect-metadata"
import { DataSource } from "typeorm"
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "guang",
    database: "ruoyi",
    synchronize: false,
    connectorPackage:'mysql2',
    logging: true,
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    poolSize: 10,
    supportBigNumbers: true,
    bigNumberStrings: true,
    // 地址注意 migration单词注意
    migrations: ['./src/migration/**.ts'],
    subscribers: [],
    // extra: {
    //     authPlugin: 'sha256_password'
    // }
})
