# GitHub Container Registry (GHCR) Deployment Guide

## Overview

This repository is configured to automatically build and push Docker images to GitHub Container Registry (GHCR) on every push to the `master` branch.

## Image Information

- **Registry**: `ghcr.io`
- **Repository**: `ghcr.io/CodingSoft/anything-llm`
- **Platforms**: `linux/amd64`, `linux/arm64`
- **Auto-tags**: `latest`, `master-sha...`, `master`

## How It Works

### Automatic Builds

When you push changes to the `master` branch:

1. GitHub Actions triggers automatically
2. Multi-arch Docker image is built (amd64 + arm64)
3. Image is pushed to `ghcr.io/CodingSoft/anything-llm`
4. Image is tagged with:
   - `latest` (default)
   - `master-sha<commit-sha>` (e.g., `master-sha1234567`)
   - `master` (branch name)

### Manual Builds

You can also trigger builds manually:

1. Go to: https://github.com/CodingSoft/anything-llm/actions/workflows/build-push-ghcr.yaml
2. Click "Run workflow"
3. Select branch and click "Run workflow"

## Pulling Images

### Latest version
```bash
docker pull ghcr.io/CodingSoft/anything-llm:latest
```

### Specific commit
```bash
docker pull ghcr.io/CodingSoft/anything-llm:master-sha1234567
```

## Deploying to VPS

### Using the Deployment Script

1. Upload the script to VPS:
```bash
scp scripts/deploy-ghcr.sh root@74.208.198.240:/root/
```

2. Make it executable:
```bash
ssh root@74.208.198.240 "chmod +x /root/deploy-ghcr.sh"
```

3. Deploy with latest image:
```bash
ssh root@74.208.198.240 "/root/deploy-ghcr.sh latest"
```

4. Deploy with specific tag:
```bash
ssh root@74.208.198.240 "/root/deploy-ghcr.sh master-sha1234567"
```

### Manual Deployment

1. SSH to VPS:
```bash
ssh root@74.208.198.240
```

2. Pull new image:
```bash
docker pull ghcr.io/CodingSoft/anything-llm:latest
```

3. Stop and remove old container:
```bash
docker stop anythingllm
docker rm anythingllm
```

4. Create new container:
```bash
docker run -d \
  --name anythingllm \
  --cap-add SYS_ADMIN \
  -p 3001:3001 \
  -v anything-llm_anythingllm-storage:/app/server/storage \
  -v anything-llm_anythingllm-logs:/app/server/logs \
  -v anything-llm_anythingllm-documents:/app/server/documents \
  --env-file /root/.env.prod \
  --add-host host.docker.internal:host-gateway \
  --network anything-llm \
  --restart unless-stopped \
  ghcr.io/CodingSoft/anything-llm:latest
```

5. Verify health:
```bash
docker logs -f anythingllm
docker ps | grep anythingllm
```

## GitHub Actions Workflow

The workflow is located at: `.github/workflows/build-push-ghcr.yaml`

### Workflow Triggers

- **Push to master**: Automatic build
- **Manual trigger**: Via GitHub UI
- **Paths ignored**: Documentation, config files, submodules

### Workflow Permissions

- `contents: read` - Read repository code
- `packages: write` - Write to GHCR

### Build Settings

- **Platforms**: linux/amd64, linux/arm64
- **Context**: Repository root
- **Dockerfile**: `./docker/Dockerfile`
- **Cache**: GitHub Actions cache enabled
- **QEMU**: Enabled for cross-platform builds

## Monitoring Builds

Check workflow runs at:
https://github.com/CodingSoft/anything-llm/actions

Check GHCR packages at:
https://github.com/CodingSoft/anything-llm/packages?package_type=container

## Troubleshooting

### Build Fails

1. Check workflow logs: https://github.com/CodingSoft/anything-llm/actions
2. Verify Dockerfile syntax
3. Check for dependency issues

### Pull Fails

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Then pull
docker pull ghcr.io/CodingSoft/anything-llm:latest
```

### Container Not Starting

```bash
# Check logs
docker logs anythingllm

# Check health status
docker inspect anythingllm --format='{{.State.Health.Status}}'

# Restart container
docker restart anythingllm
```

## Next Steps

- [ ] Enable GitHub Actions for packages (if not enabled)
- [ ] Configure automated deployments
- [ ] Set up monitoring and alerts
- [ ] Create release tags for versioned images

## References

- [GitHub Container Registry Docs](https://docs.github.com/es/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [GitHub Actions for Docker](https://docs.github.com/es/actions/publishing-packages/publishing-docker-images)
