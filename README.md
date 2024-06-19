# Repository for web service

## Build and push image

```sh
rm -rf build
docker build -f Dockerfile.build -t eegfaktura-web-build:latest .
docker run -v ./build:/app/build eegfaktura-web-build:latest
docker build -f Dockerfile -t registry.energiegemeinschaft.xyz/eegfaktura-web:latest .
docker push registry.energiegemeinschaft.xyz/eegfaktura-web:latest
```
