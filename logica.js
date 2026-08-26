const telaInicio = document.getElementById('tela-inicio');
const containerVR = document.getElementById('container-vr');
const avisoEl = document.getElementById('aviso');
const btnIniciar = document.getElementById('btn-iniciar');
const btnConfig = document.getElementById('btn-config');
const btnSair = document.getElementById('botao-sair');
const canvas = document.getElementById('cena');

let renderizador, cena, camera;

function prepararAmbiente() {
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x0b1020);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1.6, 0);

    renderizador = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(window.devicePixelRatio);
    renderizador.xr.enabled = true;

    cena.add(new THREE.AmbientLight(0xffffff, 0.6));
    const luz = new THREE.DirectionalLight('#ffffff', 0.9);
    luz.position.set(5, 10, 5);
    cena.add(luz);

    const chao = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 16),
        new THREE.MeshStandardMaterial({color: '#207520'})
    );
    chao.rotation.x = -Math.PI / 2;
    cena.add(chao);

    const cubo = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({color: '#00b8ff', metalness: 0.35})
    );
    cubo.position.set(-1.2, 1.3, -2.2);
    cubo.userData.tipo = "animado";
    cena.add(cubo);

    const esfera = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 32, 32),
        new THREE.MeshStandardMaterial({color: '#ff4488'})
    );
    esfera.position.set(1.2, 1.5, -2.4);
    cena.add(esfera);
}

btnIniciar.addEventListener('click', async () => {
    avisoEl.style.display = "block";
    avisoEl.textContent = "Solicitando câmera/sensores...";
    try {
        if (!renderizador) prepararAmbiente();
        telaInicio.style.display = "none";
        containerVR.style.display = "block";

        await renderizador.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor'],
            optionalFeatures: ['hit-test', 'bounded-floor']
        });

        avisoEl.textContent = "✅ Pronto! Coloque no seu VR Box";
        animarCena();
    } catch (e) {
        console.error(e);
        avisoEl.innerHTML = "⚠️ Permita câmera ou instale/atualize ARCore/Chrome!";
        telaInicio.style.display = "flex";
        containerVR.style.display = "none";
    }
});

btnConfig.addEventListener('click', () => {
    alert("⚙️ Configurações:\n• Use conexão segura\n• Permita Câmera e Sensores\n• Atualize Chrome e Serviços ARCore\n• GitHub Pages funciona bem");
});

btnSair.addEventListener('click', async () => {
    if (renderizador?.xr?.isPresenting) {
        const sessao = await renderizador.xr.getSession();
        sessao?.end();
    }
    containerVR.style.display = "none";
    telaInicio.style.display = "flex";
    avisoEl.style.display = "none";
});

function animarCena() {
    function loop() {
        renderizador.setAnimationLoop(loop);
        const tempo = performance.now() / 1000;
        cena.children.forEach(obj => {
            if (obj.userData.tipo === "animado") {
                obj.rotation.y = tempo;
                obj.position.y = 1.3 + Math.sin(tempo * 1.7) * 0.25;
            }
        });
        renderizador.render(cena, camera);
    }
    loop();
}

window.addEventListener('resize', () => {
    if (!camera || !renderizador) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
});
                            
