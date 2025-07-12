FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y compilar
COPY . .
RUN npm run build

# ⚠️ Copiar solo el archivo lambda.js a la raíz donde Lambda lo espera
COPY dist/lambda.js /var/task/lambda.js
COPY dist/app.js /var/task/app.js            # si tu app.ts es requerido
COPY dist/config /var/task/config            # si tu ormconfig está separado
COPY dist/modules /var/task/modules          # tus rutas y entidades

# Opcional: Swagger si lo sirves desde disco
COPY swagger.json /var/task/swagger.json

CMD ["lambda.lambdaHandler"]
