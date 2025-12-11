# 部署配置说明

## 域名配置

本项目已配置为使用域名 `lithogpt.com`。

### 配置文件说明

#### 1. Nginx 配置 (`nginx.conf`)
- `server_name`: 已配置为 `lithogpt.com` 和 `www.lithogpt.com`
- API 代理: 代理到本地后端服务 `127.0.0.1:8091`

#### 2. 环境变量配置

创建以下环境变量文件：

**`.env`** (开发环境):
```env
VITE_API_BASE_URL=http://localhost:8091
```

**`.env.production`** (生产环境):
```env
VITE_API_BASE_URL=http://lithogpt.com:8091
```

#### 3. Docker 配置

- `Dockerfile`: 构建时使用 `VITE_API_BASE_URL=http://lithogpt.com:8091`
- `docker-compose.yml`: 同样配置了生产环境的 API URL

### 部署步骤

1. **确保域名解析正确**
   - 确保 `lithogpt.com` 和 `www.lithogpt.com` 已正确解析到服务器 IP `103.143.81.103`

2. **构建 Docker 镜像**
   ```bash
   docker-compose build
   ```

3. **启动服务**
   ```bash
   docker-compose up -d
   ```

4. **验证配置**
   - 访问 `http://lithogpt.com` 应该能看到前端页面
   - API 请求应该通过 `/api` 路径代理到后端

### 注意事项

1. **API 代理配置**: 
   - 如果后端服务在 Docker 容器中，可能需要修改 `nginx.conf` 中的 `proxy_pass` 地址
   - 如果后端在宿主机上，使用 `127.0.0.1:8091`
   - 如果后端在另一个容器中，使用容器名称或 Docker 网络 IP

2. **HTTPS 配置** (可选):
   - 如需配置 HTTPS，需要：
     - 申请 SSL 证书（如 Let's Encrypt）
     - 更新 `nginx.conf` 添加 SSL 配置
     - 修改监听端口为 443
     - 配置证书路径

3. **防火墙设置**:
   - 确保服务器防火墙开放 80 端口（HTTP）
   - 如需 HTTPS，开放 443 端口

### 故障排查

1. **无法访问域名**:
   - 检查 DNS 解析是否正确
   - 检查服务器防火墙设置
   - 检查 Nginx 服务是否正常运行

2. **API 请求失败**:
   - 检查后端服务是否在运行
   - 检查 `nginx.conf` 中的 `proxy_pass` 配置
   - 查看 Nginx 错误日志: `docker logs lithogpt-frontend`

3. **构建失败**:
   - 检查环境变量是否正确设置
   - 检查 Docker 构建参数

