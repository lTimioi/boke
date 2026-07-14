# Kirameku 项目一键启动脚本
# 使用方法：在项目根目录运行 .\start-project.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Kirameku 项目启动中..." -ForegroundColor Cyan
Write-Host ""

# 检查前端依赖
Write-Host "📦 检查前端依赖..." -ForegroundColor Yellow
if (-Not (Test-Path "Kirameku\node_modules")) {
    Write-Host "   安装前端依赖..." -ForegroundColor Gray
    Set-Location Kirameku
    pnpm install
    Set-Location ..
} else {
    Write-Host "   ✓ 前端依赖已存在" -ForegroundColor Green
}

# 检查后端依赖
Write-Host "📦 检查后端依赖..." -ForegroundColor Yellow
if (-Not (Test-Path "Kirameku-backend\venv")) {
    Write-Host "   创建虚拟环境并安装依赖..." -ForegroundColor Gray
    Set-Location Kirameku-backend
    python -m venv venv
    .\venv\Scripts\pip.exe install -r requirements.txt
    Set-Location ..
} else {
    Write-Host "   ✓ 后端依赖已存在" -ForegroundColor Green
}

# 检查 .env 文件
if (-Not (Test-Path "Kirameku-backend\.env")) {
    Write-Host ""
    Write-Host "⚠️  警告：未找到 Kirameku-backend\.env 文件" -ForegroundColor Red
    Write-Host "   请复制 .env.example 为 .env 并配置数据库连接信息" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎯 启动服务..." -ForegroundColor Cyan
Write-Host ""

# 启动后端
Write-Host "🔧 启动后端服务 (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Kirameku-backend; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# 等待后端启动
Start-Sleep -Seconds 3

# 启动前端
Write-Host "🎨 启动前端服务 (Next.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Kirameku; pnpm dev"

Write-Host ""
Write-Host "✅ 服务启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📍 访问地址：" -ForegroundColor Cyan
Write-Host "   前端：http://localhost:3000" -ForegroundColor White
Write-Host "   后端 API 文档：http://localhost:8000/docs" -ForegroundColor White
Write-Host "   管理后台：http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出此窗口（服务会继续运行）..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
