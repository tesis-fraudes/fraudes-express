FROM public.ecr.aws/lambda/nodejs:20

# 1. Crear carpeta de trabajo
WORKDIR /app

# 2. Copiar todo el proyecto
COPY . .

# 3. Instalar dependencias y compilar
RUN npm install && npm run build

# 4. Copiar el contenido de dist al directorio /var/task
#    Lambda requiere los archivos directamente ahí
RUN cp -r dist/* /var/task

# 5. Copiar swagger.json si es necesario
COPY swagger.json /var/task/swagger.json

# 6. Definir el handler
CMD ["lambda.lambdaHandler"]
