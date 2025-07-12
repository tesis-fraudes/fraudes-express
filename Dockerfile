FROM public.ecr.aws/lambda/nodejs:20

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package y lock
COPY package*.json ./

# Instalar dependencias (incluye @vendia/serverless-express)
RUN npm install

# Copiar todo el código fuente
COPY . .

# Compilar
RUN npm run build

# Copiar todo lo compilado a donde Lambda lo ejecutará
RUN cp -r dist/* /var/task

# Si usas swagger.json
COPY swagger.json /var/task/swagger.json

# Comando de arranque
CMD ["lambda.lambdaHandler"]
