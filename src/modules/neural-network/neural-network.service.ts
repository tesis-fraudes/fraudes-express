import axios from 'axios';
import AWS from 'aws-sdk';
import FormData from 'form-data';
import fs from 'fs';

import NeuralNetwork from './neural-network.model';

const TRAIN_API_URL = 'https://vnl7jyouid.execute-api.us-east-1.amazonaws.com//train';

export interface TrainParams {
  filePath: string;
  modelName: string;
  userCode: number;
}

async function train({ filePath, modelName, userCode }: TrainParams) {
  // 1) Llamar API de entrenamiento con el CSV
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const { data } = await axios.post(TRAIN_API_URL, form, {
    headers: { ...form.getHeaders(), accept: 'application/json' },
    maxBodyLength: Infinity,
    timeout: 1000 * 60 * 10, // ajusta si tu entrenamiento tarda más
  });

  const toNum = (v: unknown) =>
  v === null || v === undefined || v === '' ? null : Number(v);

  // 2) Insertar en BD solo si hubo respuesta OK
  const metrics = data?.metrics ?? {};
  const created = await NeuralNetwork.create({
    userId: Number(userCode),
    modelName,
    s3Bucket: data?.s3_bucket ?? null,
    modelKey: data?.model_key ?? null,
    accuracy: toNum(metrics?.accuracy),
    precision: toNum(metrics?.precision),
    recall: toNum(metrics?.recall),
    f1: toNum(metrics?.f1),
    tp: toNum(metrics?.tp),
    tn: toNum(metrics?.tn),
    fp: toNum(metrics?.fp),
    fn: toNum(metrics?.fn),
    status: 0,
  });

  // (opcional) eliminar archivo temporal
  fs.unlink(filePath, () => {});

  return {
    message: data?.message ?? 'Modelo entrenado',
    record: created,
  };
}

const s3 = new AWS.S3({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  endpoint: process.env.CLOUDFLARE_S3_ENDPOINT,
  s3ForcePathStyle: true,
});

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
  await NeuralNetwork.update({ status: 0 }, { where: {} });
  const fileStream = fs.createReadStream(file.path);
  const key = `modelos/${Date.now()}_${file.originalname}`;

  const uploadParams = {
    Bucket: bucketName!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(uploadParams).promise();
  fs.unlinkSync(file.path);

  // const entity = await NeuralNetwork.create({
  //   modelo,
  //   version,
  //   urlFile: uploadResult.Location,
  //   createdBy: 'system',
  // });

  const entity = null;
  return entity;
};

const getAll = async () => {
  return await NeuralNetwork.findAll({ order: [['createAt', 'DESC']] });
};

const getById = async (id: number) => {
  return await NeuralNetwork.findByPk(id);
};

export default { procesarYGuardar, getAll, getById, train };
