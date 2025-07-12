FROM public.ecr.aws/lambda/nodejs:20

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ✅ Copiar todo dist y node_modules al path correcto para Lambda
RUN cp -r dist/* /var/task \
 && cp -r node_modules /var/task \
 && cp package*.json /var/task

# Copiar swagger.json si lo usas
COPY swagger.json /var/task/swagger.json

# Handler
CMD ["lambda.lambdaHandler"]
