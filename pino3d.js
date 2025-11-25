import * as THREE from 'three';

// --- 1. CONFIGURAÇÃO DO AMBIENTE ---
const container = document.querySelector('.pinHolder');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5); // Fundo cinza claro

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);

// Câmera travada na diagonal alta para ver bem as formas
camera.position.set(5, 8, 5); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
container.appendChild(renderer.domElement);

// Luzes
const lightDir = new THREE.DirectionalLight(0xffffff, 1.5);
lightDir.position.set(5, 10, 7);
scene.add(lightDir);

const lightAmb = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(lightAmb);


// --- 2. CRIANDO O PINO CENTRAL ---
const geometriaHaste = new THREE.CylinderGeometry(0.3, 0.3, 7, 32);
const materialHaste = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    roughness: 0.4,
    metalness: 0.5
});
const haste = new THREE.Mesh(geometriaHaste, materialHaste);
scene.add(haste);

const geometriaBase = new THREE.CylinderGeometry(2, 2, 0.2, 32);
const meshBase = new THREE.Mesh(geometriaBase, materialHaste);
meshBase.position.y = -3.5; 
scene.add(meshBase);


// --- 3. PREPARANDO OS SLOTS (LUGAR DAS PEÇAS) ---
const slot1 = new THREE.Group();
const slot2 = new THREE.Group();
const slot3 = new THREE.Group();

// Ajuste de altura das peças
slot1.position.y = -2; 
slot2.position.y = 0;
slot3.position.y = 2;

scene.add(slot1);
scene.add(slot2);
scene.add(slot3);


// --- 4. A FÁBRICA DE PEÇAS (COM CONTORNO PRETO) ---
function criarPecaProcedural(tipo) {
    let geometria;
    let corPeca;

    switch (tipo) {
        case 'Circulo':
            geometria = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
            corPeca = 0x3498db; // Azul
            break;
        case 'Quadrado':
            geometria = new THREE.CylinderGeometry(1.8, 1.8, 1, 4);
            corPeca = 0xe74c3c; // Vermelho
            break;
        case 'Hexagono':
            geometria = new THREE.CylinderGeometry(1.6, 1.6, 1, 6);
            corPeca = 0xf1c40f; // Amarelo
            break;
        default:
            return null;
    }

    // Material Sólido (Flat Shading ajuda a ver as arestas do hexágono)
    const material = new THREE.MeshStandardMaterial({ 
        color: corPeca, 
        roughness: 0.1, 
        metalness: 0.1,
        flatShading: true 
    });
    const mesh = new THREE.Mesh(geometria, material);

    // Linhas de Contorno (Edges)
    const edges = new THREE.EdgesGeometry(geometria);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
    mesh.add(line); 
    
    // Rotações para alinhar com a câmera
    if(tipo === 'Quadrado') mesh.rotation.y = Math.PI / 4; 
    if(tipo === 'Hexagono') mesh.rotation.y = 0; 

    return mesh;
}


// --- 5. FUNÇÃO PARA ATUALIZAR O 3D ---
function atualizarPeca(numeroSlot, tipoPeca) {
    let slotAlvo;
    if(numeroSlot === 1) slotAlvo = slot1;
    if(numeroSlot === 2) slotAlvo = slot2;
    if(numeroSlot === 3) slotAlvo = slot3;

    // Remove peça anterior
    while(slotAlvo.children.length > 0){ 
        if(slotAlvo.children[0].geometry) slotAlvo.children[0].geometry.dispose();
        slotAlvo.remove(slotAlvo.children[0]); 
    }

    // Adiciona nova peça
    if(tipoPeca && tipoPeca !== "") {
        const novaPeca = criarPecaProcedural(tipoPeca);
        if(novaPeca) slotAlvo.add(novaPeca);
    }
}


// --- 6. CONTROLE DE FLUXO E EVENTOS (LÓGICA DOS BOTÕES) ---
const selPeca1 = document.getElementById('peca1');
const selPeca2 = document.getElementById('peca2');
const selPeca3 = document.getElementById('peca3');
const btnLimpar = document.getElementById('btnLimpar');

function resetarSelect(select) {
    select.selectedIndex = 0; 
    select.disabled = true;  
}

// Evento Peça 1
selPeca1.addEventListener('change', (e) => {
    atualizarPeca(1, e.target.value);
    selPeca1.disabled = true; // Trava este
    selPeca2.disabled = false; // Libera o próximo
});

// Evento Peça 2
selPeca2.addEventListener('change', (e) => {
    atualizarPeca(2, e.target.value);
    selPeca2.disabled = true;
    selPeca3.disabled = false;
});

// Evento Peça 3
selPeca3.addEventListener('change', (e) => {
    atualizarPeca(3, e.target.value);
    selPeca3.disabled = true;
    // Fim do fluxo
});

// Evento Limpar
if(btnLimpar) {
    btnLimpar.addEventListener('click', () => {
        // Limpa visual 3D
        atualizarPeca(1, null);
        atualizarPeca(2, null);
        atualizarPeca(3, null);

        // Reseta os selects
        selPeca1.selectedIndex = 0;
        resetarSelect(selPeca2);
        resetarSelect(selPeca3);

        // Libera o primeiro para recomeçar
        selPeca1.disabled = false;
    });
}


// --- 7. LOOP DE ANIMAÇÃO ---
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();