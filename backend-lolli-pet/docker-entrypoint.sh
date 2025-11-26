#!/bin/sh

echo "================================"
echo "🔄 Aguardando banco de dados..."
echo "================================"

# Aguarda 10 segundos para garantir que o banco está completamente pronto
# O Docker Compose já garante via healthcheck, mas damos um tempo extra
sleep 10

echo "✅ Banco de dados deve estar pronto!"
echo ""

echo "================================"
echo "📊 Executando migrations..."
echo "================================"

npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations executadas com sucesso!"
  echo ""
else
  echo ""
  echo "❌ Erro ao executar migrations!"
  echo "Verifique as configurações do banco de dados."
  echo ""
  exit 1
fi

echo "================================"
echo "🚀 Iniciando servidor..."
echo "================================"
echo ""

exec npm start
