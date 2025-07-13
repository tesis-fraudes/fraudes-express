import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { AppDataSource } from '../../config/ormconfig'; // ajusta ruta
import NeuralNetwork from './neural-network.entity';

// AWS.config.update({
//   accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
//   secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
//   endpoint: process.env.CLOUDFLARE_S3_ENDPOINT, // por ej: https://<accountid>.r2.cloudflarestorage.com
//   region: 'auto',
//   s3ForcePathStyle: true,
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  endpoint: process.env.CLOUDFLARE_S3_ENDPOINT, // ✅ correcto aquí
  region: 'auto',
  s3ForcePathStyle: true,
});

//const s3 = new AWS.S3();

const bucketName = process.env.CLOUDFLARE_BUCKET_NAME;

type UploadInput = {
  file: Express.Multer.File;
  modelo: string;
  version: string;
  accuracy: string;
  status: string;
};

const procesarYGuardar = async ({
  file,
  modelo,
  version,
  accuracy,
  status,
}: UploadInput) => {
  const repo = AppDataSource.getRepository(NeuralNetwork);
  await repo.createQueryBuilder()
    .update(NeuralNetwork)
    .set({ status: 'Inactivo' })
    //.where('status = :status', { status: 'Activo' })
    .execute();

  const fileStream = fs.createReadStream(file.path);
  const key = `modelos/${Date.now()}_${file.originalname}`;

  const uploadParams = {
    Bucket: bucketName!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(uploadParams).promise();
  fs.unlinkSync(file.path); // limpiar archivo local

  

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
  return await AppDataSource.getRepository(NeuralNetwork).find({
    order: { createAt: 'DESC' },
  });
};

const getById = async (id: number) => {
  return await AppDataSource.getRepository(NeuralNetwork).findOne({
    where: { id },
  });
};

export default { procesarYGuardar, getAll, getById };
