import fs from 'fs';
import AWS from 'aws-sdk';
import NeuralNetwork from './neural-network.model';

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
  await NeuralNetwork.update({ status: 'Inactivo' }, { where: {} });
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

  const entity = await NeuralNetwork.create({
    modelo,
    version,
    accuracy,
    status,
    urlFile: uploadResult.Location,
    createdBy: 'system',
  });

  return entity;
};

const getAll = async () => {
  return await NeuralNetwork.findAll({ order: [['createAt', 'DESC']] });
};

const getById = async (id: number) => {
  return await NeuralNetwork.findByPk(id);
};

export default { procesarYGuardar, getAll, getById };
