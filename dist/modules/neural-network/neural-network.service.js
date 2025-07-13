"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ormconfig_1 = require("../../config/ormconfig"); // ajusta ruta
const neural_network_entity_1 = require("./neural-network.entity");
// AWS.config.update({
//   accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
//   secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
//   endpoint: process.env.CLOUDFLARE_S3_ENDPOINT, // por ej: https://<accountid>.r2.cloudflarestorage.com
//   region: 'auto',
//   s3ForcePathStyle: true,
// });
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
    endpoint: process.env.CLOUDFLARE_S3_ENDPOINT, // ✅ correcto aquí
    region: 'auto',
    s3ForcePathStyle: true,
});
//const s3 = new AWS.S3();
const bucketName = process.env.CLOUDFLARE_BUCKET_NAME;
const procesarYGuardar = async ({ file, modelo, version, accuracy, status, }) => {
    const repo = ormconfig_1.AppDataSource.getRepository(neural_network_entity_1.NeuralNetwork);
    await repo.createQueryBuilder()
        .update(neural_network_entity_1.NeuralNetwork)
        .set({ status: 'Inactivo' })
        //.where('status = :status', { status: 'Activo' })
        .execute();
    const fileStream = fs_1.default.createReadStream(file.path);
    const key = `modelos/${Date.now()}_${file.originalname}`;
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
    };
    const uploadResult = await s3.upload(uploadParams).promise();
    fs_1.default.unlinkSync(file.path); // limpiar archivo local
    const entity = repo.create({
        modelo,
        version,
        accuracy,
        status,
        urlFile: uploadResult.Location,
    });
    return await repo.save(entity);
};
const getAll = async () => {
    return await ormconfig_1.AppDataSource.getRepository(neural_network_entity_1.NeuralNetwork).find({
        order: { createAt: 'DESC' },
    });
};
const getById = async (id) => {
    return await ormconfig_1.AppDataSource.getRepository(neural_network_entity_1.NeuralNetwork).findOne({
        where: { id },
    });
};
exports.default = { procesarYGuardar, getAll, getById };
