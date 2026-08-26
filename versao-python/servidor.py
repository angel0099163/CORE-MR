# Servidor local simples para testar o App VR Box
# Funciona na mesma rede Wi‑Fi — acessa do celular fácil!

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORTA = 8000
PASTA_PUBLICA = "public"

os.chdir(PASTA_PUBLICA)  # Tudo que estiver aqui fica acessível

servidor = HTTPServer(("", PORTA), SimpleHTTPRequestHandler)

print(f"✅ Servidor rodando na porta {PORTA}")
print(f"🌐 Acesse por: http://localhost:{PORTA}")
print("📱 No celular: use o IP do computador, ex: http://192.168...:" + str(PORTA))
print("🛑 Para parar: aperte Ctrl + C")

try:
    servidor.serve_forever()
except KeyboardInterrupt:
    print("\n✅ Servidor finalizado.")
