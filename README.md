# 🥽 CORE‑MR — VR Box com Realidade Mista
Aplicativo de **Realidade Mista/Virtual** leve e compatível com celulares + óculos VR Box / Cardboard.
Funciona direto no navegador usando WebXR — sem instalações complicadas!

## 📁 Estrutura
- 📄 `index.html` → Arquivo principal: **abra direto no Chrome do celular**
- 📁 `versao-python/` → Servidor local para testar na rede Wi‑Fi
  - `servidor.py` → Servidor HTTP simples
  - 📁 `public/index.html` → Cópia servida pelo Python

## ✅ Recursos
- ✔️ Pronto para **óculos VR Box**
- ✔️ Ambiente 3D com Three.js + WebXR
- ✔️ Usa câmera e sensores do celular
- ✔️ Código comentado e fácil de editar

## 🚀 Usar
1. **Modo rápido**: Abra `index.html` no navegador compatível.
2. **Com Python**:
```bash
cd versao-python
python servidor.py
