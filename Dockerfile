FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
# Trabajar desde dist
WORKDIR /app/dist

CMD [ "lambda.lambdaHandler" ]
