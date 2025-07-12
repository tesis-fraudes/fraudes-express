FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Copiar swagger y entorno si aplica
COPY swagger.json ./dist/

CMD [ "lambda.lambdaHandler" ]
