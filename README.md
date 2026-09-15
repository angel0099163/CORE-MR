# Core MR

Experiência web para VR Box com vídeo da câmera e esqueleto das mãos via MediaPipe Hands. Interface em português, escolha de câmera frontal/traseira e cor personalizável (salva localmente).

## Executar

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Abra `index.html` (ou `Index.html`). No celular, **HTTPS é obrigatório** para acessar a câmera; localhost também é permitido para desenvolvimento. Hospedagem estática, incluindo GitHub Pages, é suficiente. Não há build.

## Usar

1. Em Configurações, selecione a câmera e a cor, depois salve.
2. Clique em Iniciar experiência e conceda permissão à câmera selecionada.
3. Aguarde o modelo carregar, posicione as mãos diante da câmera e gire o aparelho na horizontal.
4. Clique em Sair (ou Escape) para desligar a câmera. Para trocar de câmera, saia e abra Configurações.

O navegador concede permissão apenas à câmera solicitada, não às duas ao mesmo tempo. A câmera traseira é recomendada para ver o ambiente. A frontal é espelhada. Os quadros são processados localmente; a biblioteca e os modelos são baixados do jsDelivr (internet necessária). Google Fonts é opcional, com fontes de sistema como alternativa.

## Limitações

- Dois painéis exibem a mesma imagem alinhada ao esqueleto: é uma visualização dividida para VR Box, **não captura 3D estereoscópica nem realidade mista com mapeamento espacial**.
- Tela cheia, bloqueio de orientação e manter a tela acesa dependem do suporte e das permissões do navegador. Quando indisponíveis, a experiência ocupa a janela do navegador.
- Ilustração da tela inicial é uma prévia, não uma detecção ao vivo.
- Detecção depende de luz, enquadramento e desempenho do aparelho. Até duas mãos, 21 pontos por mão.
- Use sentado e em local seguro, sem caminhar com o VR Box. A câmera precisa ficar desobstruída.

Os arquivos `index.html` e `Index.html` são entradas idênticas para compatibilidade com o nome original do repositório. Mantenha-os sincronizados.
