# Stage 1: Build
FROM node:20 AS build
ADD . /app
WORKDIR /app
RUN npm install && npm run build 

FROM public.ecr.aws/lambda/nodejs:20 AS deploy
RUN ls && pwd && pwd
COPY --from=build /app/build ${LAMBDA_TASK_ROOT}
COPY --from=build /app/package.json ${LAMBDA_TASK_ROOT}
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}
COPY --from=build /app/.env ${LAMBDA_TASK_ROOT}
CMD ["build/server.handler"]