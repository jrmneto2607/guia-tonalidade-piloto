// ==========================================
// VARIÁVEIS GLOBAIS E DICIONÁRIOS
// ==========================================
const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const notesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
let currentNotes = notesSharp; 

const ptNoteNames = {
    'C': 'Dó', 'C#': 'Dó sustenido', 'Db': 'Ré bemol', 'D': 'Ré', 'D#': 'Ré sustenido', 'Eb': 'Mi bemol',
    'E': 'Mi', 'F': 'Fá', 'F#': 'Fá sustenido', 'Gb': 'Sol bemol', 'G': 'Sol', 'G#': 'Sol sustenido', 
    'Ab': 'Lá bemol', 'A': 'Lá', 'A#': 'Lá sustenido', 'Bb': 'Si bemol', 'B': 'Si', 'Cb': 'Dó bemol'
};

const rootToIndex = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11
};

const tuning = [4, 11, 7, 2, 9, 4]; // Afinação Padrão: E, B, G, D, A, E

let showTetrads = false;
let currentMinorType = 'minorNatural'; 

const patterns = { 
    major: [0,2,4,5,7,9,11], 
    minorNatural: [0,2,3,5,7,8,10], 
    minorHarmonic: [0,2,3,5,7,8,11],
    minorMelodic: [0,2,3,5,7,9,11] 
};

const scaleIntervalNames = {
    major: ['1', '2', '3', '4', '5', '6', '7'],
    minorNatural: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    minorHarmonic: ['1', '2', 'b3', '4', '5', 'b6', '7'],
    minorMelodic: ['1', '2', 'b3', '4', '5', '6', '7']
};

const harmonicFunctions = {
    major: ["Tônica", "Supertônica", "Mediante", "Subdominante", "Dominante", "Sobredominante", "Sensível"],
    minorNatural: ["Tônica", "Supertônica", "Mediante", "Subdominante", "Dominante", "Sobredominante", "Subtônica"],
    minorHarmonic: ["Tônica", "Supertônica", "Mediante", "Subdominante", "Dominante", "Sobredominante", "Sensível"],
    minorMelodic: ["Tônica", "Supertônica", "Mediante", "Subdominante", "Dominante", "Sobredominante", "Sensível"]
};

const triadSfx = { 
    major: ["","m","m","","","m","dim"], 
    minorNatural: ["m","dim","","m","m","",""], 
    minorHarmonic: ["m","dim","aug","m","","","dim"],
    minorMelodic: ["m","m","aug","","","dim","dim"]
};

const tetradSfx = { 
    major: ["7M","m7","m7","7M","7","m7","m7b5"], 
    minorNatural: ["m7","m7b5","7M","m7","m7","7M","7"], 
    minorHarmonic: ["m(7M)","m7b5","7M(#5)","m7","7","7M","dim7"],
    minorMelodic: ["m(7M)","m7","7M(#5)","7","7","m7b5","m7b5"] 
};

// Dicionário com a fórmula de cada acorde (em semitons a partir da tônica)
        const chordIntervals = {
            "": [0, 4, 7],               // Maior
            "m": [0, 3, 7],              // Menor
            "dim": [0, 3, 6],            // Diminuto
            "aug": [0, 4, 8],            // Aumentado
            "7M": [0, 4, 7, 11],         // Maior com 7ª Maior
            "m7": [0, 3, 7, 10],         // Menor com 7ª Menor
            "7": [0, 4, 7, 10],          // Maior com 7ª Menor (Dominante)
            "m7b5": [0, 3, 6, 10],       // Meio Diminuto
            "m(7M)": [0, 3, 7, 11],      // Menor com 7ª Maior
            "7M(#5)": [0, 4, 8, 11],     // Maior com 5ª Aumentada e 7ª Maior
            "dim7": [0, 3, 6, 9]         // Diminuto com 7ª Diminuta
        };

// ==========================================
// MAPEAMENTO DO SISTEMA CAGED
// ==========================================
const cagedMaps = {
    major: {
        'C': { rStr: 5, barreOffset: -3, dots: [[5,3],[4,2],[3,0],[2,1],[1,0]], mute: [6] },
        'A': { rStr: 5, barreOffset: 0, dots: [[5,0],[4,2],[3,2],[2,2],[1,0]], mute: [6] },
        'G': { rStr: 6, barreOffset: -3, dots: [[6,3],[5,2],[4,0],[3,0],[2,0],[1,3]] },
        'E': { rStr: 6, barreOffset: 0, dots: [[6,0],[5,2],[4,2],[3,1],[2,0],[1,0]] },
        'D': { rStr: 4, barreOffset: 0, dots: [[4,0],[3,2],[2,3],[1,2]], mute: [5,6] }
    },
    minor: {
        'C': { rStr: 5, barreOffset: -3, dots: [[5,3],[4,1],[3,0],[2,1]], mute: [6,1] },
        'A': { rStr: 5, barreOffset: 0, dots: [[5,0],[4,2],[3,2],[2,1],[1,0]], mute: [6] },
        'G': { rStr: 6, barreOffset: -3, dots: [[6,3],[5,1],[4,0],[3,0],[2,3],[1,3]] },
        'E': { rStr: 6, barreOffset: 0, dots: [[6,0],[5,2],[4,2],[3,0],[2,0],[1,0]] },
        'D': { rStr: 4, barreOffset: 0, dots: [[4,0],[3,2],[2,3],[1,1]], mute: [5,6] }
    }
};

// ==========================================
// FUNÇÕES DE INTERAÇÃO
// ==========================================
function toggleTetrads() {
    showTetrads = !showTetrads;
    document.getElementById('tetrad-btn').innerText = showTetrads ? "Tétrades" : "Tríades";
    document.getElementById('tetrad-btn').classList.toggle('active');
    updateApp();
}

function closeOverlay() { 
    document.getElementById('chord-overlay').style.display = 'none'; 
}

function setMinorType(type, btnElement) {
    currentMinorType = type;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btnElement.classList.add('active');
    updateApp();
}

// ==========================================
// MOTOR DE DESENHO SVG (ACORDES NO CAGED)
// ==========================================
function drawSVG(chordNote, model, suffix) {
    const rootIdx = currentNotes.indexOf(chordNote); 
    const stringNotes = [0, 4, 11, 7, 2, 9, 4];
    
    const isMinorTriad = suffix.includes('m') || suffix.includes('dim');
    const isDim = suffix.includes('dim') || suffix.includes('b5');
    const isAug = suffix.includes('aug') || suffix.includes('#5');
    
    const map = isMinorTriad ? cagedMaps.minor[model] : cagedMaps.major[model];
    
    let rootFret = (rootIdx - stringNotes[map.rStr] + 12) % 12;
    let barreFret = rootFret + map.barreOffset;
    
    if (barreFret < 0) {
        rootFret += 12;
        barreFret += 12;
    }
    
    let dynamicMutes = [...(map.mute || [])];
    let absoluteDots = [];
    
    // 1. Montar a base do acorde
    map.dots.forEach(d => {
        let f = barreFret + d[1];
        let noteIdx = (stringNotes[d[0]] + f) % 12;
        let interval = (noteIdx - rootIdx + 12) % 12;
        
        if (interval === 7) {
            if (isDim) f -= 1; 
            if (isAug) f += 1; 
        }
        
        if (f < 0) {
            dynamicMutes.push(d[0]); 
        } else {
            absoluteDots.push({ str: d[0], fret: f });
        }
    });

    // 2. Motor de Inteligência para Tétrades
    if (showTetrads) {
        let seventhInterval = 10; // 7ª Menor
        if (suffix.includes('7M')) seventhInterval = 11; // 7ª Maior
        if (suffix.includes('dim7')) seventhInterval = 9; // 7ª Diminuta

        let targetNoteIdx = (rootIdx + seventhInterval) % 12;
        let bestOption = null;
        let bestScore = -9999;

        for (let i = 0; i < absoluteDots.length; i++) {
            let dot = absoluteDots[i];
            let str = dot.str;
            if (str === map.rStr) continue; // Nunca altera o Baixo

            let originalNoteIdx = (stringNotes[str] + dot.fret) % 12;
            let originalInterval = (originalNoteIdx - rootIdx + 12) % 12;

            let minF = barreFret > 0 ? barreFret : 0;
            let maxF = minF + 4; // Limite físico dos dedos

            for(let testF = minF; testF <= maxF; testF++) {
                if ((stringNotes[str] + testF) % 12 === targetNoteIdx) {
                    let score = 0;
                    if (originalInterval === 0) score += 100; // Prioridade: Tônica duplicada
                    else if (originalInterval === 7) score += 50; // Plano B: 5ª Justa
                    else if (originalInterval === 6 || originalInterval === 8) score += 40; // 5ª Alterada
                    else score -= 100; // Evita substituir a terça

                    score += (str * 0.1);

                    if (score > bestScore) {
                        bestScore = score;
                        bestOption = { index: i, newFret: testF };
                    }
                }
            }
        }

        if (bestOption) {
            absoluteDots[bestOption.index].fret = bestOption.newFret;
            absoluteDots[bestOption.index].isSeventh = true; 
        }
    }

    // 3. Renderização Visual do SVG
    let startFret = barreFret;
    if (startFret <= 0) startFret = 1;
    let labelText = startFret > 1 ? startFret + 'ª' : '';

    let svg = `<svg width="100" height="135" viewBox="0 0 80 100">
        <text x="2" y="10" font-size="8" fill="#888">${labelText}</text>
        <rect x="15" y="15" width="50" height="70" fill="none" stroke="#444"/>`;

    //if (startFret === 1) svg += `<line x1="15" y1="15" x2="65" y2="15" stroke="#d1d1d1" stroke-width="3.5"/>`;

    for(let i=1; i<4; i++) svg += `<line x1="15" y1="${15+i*17.5}" x2="65" y2="${15+i*17.5}" stroke="#333"/>`;
    
    for(let i=0; i<6; i++) {
        let x = 15+i*10; let sNum = 6-i;
        svg += `<line x1="${x}" y1="15" x2="${x}" y2="85" stroke="#333"/>`;
        
        if(dynamicMutes.includes(sNum)) {
            svg += `<text x="${x-3}" y="10" font-size="9" fill="var(--accent)">x</text>`;
        } else {
            let openDot = absoluteDots.find(d => d.str === sNum && d.fret === 0);
            if(openDot) {
                let noteIdx = stringNotes[sNum] % 12;
                let isRoot = (noteIdx === rootIdx);
                let stroke = openDot.isSeventh ? 'var(--altered)' : (isRoot ? 'var(--tonic)' : '#888');
                let strokeW = (openDot.isSeventh || isRoot) ? '2' : '1';
                svg += `<circle cx="${x}" cy="7" r="${openDot.isSeventh || isRoot ? 3 : 2.5}" fill="none" stroke="${stroke}" stroke-width="${strokeW}"/>`;
            }
        }
    }

    if(barreFret > 0 && model !== 'D') {
        let x1 = 15; let x2 = 65;
        if(model === 'A' || model === 'C') x1 = 15 + (6-5)*10;
        
        let barreRelY = barreFret - startFret;
        if (barreRelY >= 0 && barreRelY < 4) {
            let y = 15 + (barreRelY * 17.5) + 8.5;
            svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="var(--tonic)" stroke-width="6" stroke-linecap="round" opacity="0.3"/>`;
        }
    }

    absoluteDots.forEach(d => {
        if (d.fret === 0) return; 
        let relFret = d.fret - startFret;
        if (relFret >= 0 && relFret < 4) {
            let x = 15 + (6-d.str)*10;
            let y = 15 + (relFret * 17.5) + 8.5;
            let noteIdx = (stringNotes[d.str] + d.fret) % 12;
            let isRoot = (noteIdx === rootIdx);

            if (barreFret > 0 && d.fret === barreFret && !isRoot) return; 
            
            let fill = 'white';
            if (isRoot) fill = 'var(--tonic)';
            else if (d.isSeventh) fill = 'var(--altered)';

            svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="${fill}"/>`;
        }
    });

    return svg + `</svg>`;
}

// ==========================================
// RENDERIZAR MODAL E CAMPOS HARMÓNICOS
// ==========================================
function openOverlay(name, note, suffix, idx, sType) {
    document.getElementById('modal-title').innerText = name;

    // ==========================================
    // NOVO: CALCULAR AS NOTAS QUE COMPÕEM O ACORDE
    // ==========================================
    const rootIdx = currentNotes.indexOf(note);
    const intervals = chordIntervals[suffix] || [0, 4, 7]; // Pega a fórmula (Maior por padrão)
    
    // Transforma os intervalos nos nomes das notas usando a escala atual
    const notesInChord = intervals.map(i => currentNotes[(rootIdx + i) % 12]).join(', ');
    document.getElementById('modal-chord-notes').innerText = `(${notesInChord})`;
    // ==========================================

    document.getElementById('modal-subtitle').innerText = `${idx+1}º Grau • ${harmonicFunctions[sType][idx]}`;
    const grid = document.getElementById('caged-grid'); grid.innerHTML = '';
    
    ['C', 'A', 'G', 'E', 'D'].forEach(m => {
        const item = document.createElement('div'); item.className = 'caged-item';
        item.innerHTML = `<label style="color:#555; font-size:0.6rem; display:block; margin-bottom:5px">MODELO ${m}</label>` + drawSVG(note, m, suffix);
        grid.appendChild(item);
    });

    const legend = document.getElementById('modal-legend');
    let legHtml = `<div style="display:flex; align-items:center;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--tonic); margin-right:6px;"></span> Tônica</div>`;
    if (showTetrads) {
        legHtml += `<div style="display:flex; align-items:center;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--altered); margin-right:6px; box-shadow: 0 0 5px var(--altered);"></span> Sétima</div>`;
    }
    legend.innerHTML = legHtml;

    document.getElementById('chord-overlay').style.display = 'flex';
}

function buildSequenceDom(rootIdx, sType, title) {
    const currentSfx = showTetrads ? tetradSfx[sType] : triadSfx[sType];
    const seqScale = patterns[sType].map(i => currentNotes[(rootIdx + i) % 12]);

    const container = document.createElement('div');
    container.style.marginBottom = '25px';
    container.style.width = '100%';

    const h3 = document.createElement('h3');
    h3.style.color = '#888'; h3.style.fontSize = '0.85rem'; h3.style.textAlign = 'center'; 
    h3.style.textTransform = 'uppercase'; h3.style.letterSpacing = '1px'; h3.style.marginBottom = '10px';
    h3.innerText = title;
    container.appendChild(h3);

    const seqDiv = document.createElement('div');
    seqDiv.className = 'harmonic-sequence';

    seqScale.forEach((n, i) => {
        const btn = document.createElement('div'); btn.className = 'chord-btn';
        btn.onclick = () => openOverlay(n + currentSfx[i], n, currentSfx[i], i, sType);
        btn.innerHTML = `<span>${n}${currentSfx[i]}</span><small>${i+1}º Grau</small>`;
        seqDiv.appendChild(btn);
    });
    
    container.appendChild(seqDiv);
    return container;
}

// ==========================================
// FUNÇÃO PRINCIPAL: ATUALIZAR APLICAÇÃO
// ==========================================
function updateApp() {
    const root = document.getElementById('root-note').value;
    const mainType = document.getElementById('scale-type').value; 
    const rootIdx = rootToIndex[root]; 
    
    // Enarmonia (Força o uso de Bemóis quando apropriado)
    let useFlats = root.includes('b') || root === 'F';
    if (mainType === 'minor' && ['C', 'G', 'D'].includes(root)) useFlats = true;
    currentNotes = useFlats ? notesFlat : notesSharp;

    const minorTabs = document.getElementById('minor-tabs');
    minorTabs.style.display = mainType === 'minor' ? 'flex' : 'none';

    // 1. Título Dinâmico (Traduzido)
    let titleText = `Escala de ${ptNoteNames[root]} `;
    if (mainType === 'major') {
        titleText += "Maior";
    } else {
        if (currentMinorType === 'minorNatural') titleText += "Menor Natural";
        else if (currentMinorType === 'minorHarmonic') titleText += "Menor Harmônica";
        else if (currentMinorType === 'minorMelodic') titleText += "Menor Melódica";
    }
    titleText += showTetrads ? " ➔ Tétrades" : " ➔ Tríades";
    document.getElementById('dynamic-title').innerText = titleText;

    // 2. Legendas (Harmônica e Melódica)
    const legendsWrap = document.getElementById('legends');
    const legHarm = document.getElementById('legend-harmonic');
    const legMel = document.getElementById('legend-melodic');

    if (mainType === 'minor' && currentMinorType !== 'minorNatural') {
        legendsWrap.style.display = 'flex';
        if (currentMinorType === 'minorHarmonic') {
            legHarm.style.display = 'flex'; legMel.style.display = 'none';
        } else if (currentMinorType === 'minorMelodic') {
            legHarm.style.display = 'flex'; legMel.style.display = 'flex';
        }
    } else {
        legendsWrap.style.display = 'none';
    }

    const fretboardType = mainType === 'major' ? 'major' : currentMinorType;

    // 3. Display de Notas da Escala (Caixas Superiores)
    const scaleDisplay = document.getElementById('scale-display');
    scaleDisplay.innerHTML = '';
    const intervals = scaleIntervalNames[fretboardType];
    const scaleNotes = patterns[fretboardType].map(i => currentNotes[(rootIdx + i) % 12]);

    scaleNotes.forEach((note, i) => {
        const box = document.createElement('div');
        box.className = 'scale-note-box';
        if (i === 0) box.classList.add('tonic-box'); 
        
        const intervalSpan = document.createElement('span');
        intervalSpan.className = 'scale-interval';
        intervalSpan.innerText = intervals[i];
        
        const noteSpan = document.createElement('span');
        noteSpan.className = 'scale-note-name';
        noteSpan.innerText = note;

        // Destaque visual
        if (fretboardType === 'minorHarmonic' && intervals[i] === '7') noteSpan.style.color = 'var(--altered)';
        if (fretboardType === 'minorMelodic') {
            if (intervals[i] === '7') noteSpan.style.color = 'var(--altered)';
            if (intervals[i] === '6') noteSpan.style.color = 'var(--altered-2)';
        }
        
        box.appendChild(intervalSpan);
        box.appendChild(noteSpan);
        scaleDisplay.appendChild(box);
    });

    // 4. Desenhar o Braço do Violão (Fretboard)
    const board = document.getElementById('fretboard'); board.innerHTML = '';
    tuning.forEach(s => {
        const row = document.createElement('div'); row.className = 'string';

        // NOVO: Adiciona a nota de afinação à esquerda
        const tuningDiv = document.createElement('div');
        tuningDiv.className = 'tuning-note';
        tuningDiv.innerText = notesSharp[s]; // Pega o nome da nota base
        row.appendChild(tuningDiv);

        for(let f=0; f<=15; f++) {
            const nIdx = (s+f)%12; 
            const fret = document.createElement('div'); fret.className = 'fret';
            
            const intervalFromRoot = (nIdx - rootIdx + 12) % 12;

            if(patterns[fretboardType].includes(intervalFromRoot)) {
                let noteClass = 'note';
                
                if (intervalFromRoot === 0) {
                    noteClass += ' tonic';
                } else {
                    if (fretboardType === 'minorHarmonic' && intervalFromRoot === 11) noteClass += ' altered'; 
                    if (fretboardType === 'minorMelodic') {
                        if (intervalFromRoot === 11) noteClass += ' altered'; 
                        if (intervalFromRoot === 9) noteClass += ' altered-2'; 
                    }
                }
                
                const d = document.createElement('div'); d.className = noteClass;
                d.innerText = currentNotes[nIdx]; fret.appendChild(d);
            }
            row.appendChild(fret);
        }
        board.appendChild(row);
    });

    // 5. Adicionar a Numeração das Casas (Rodapé do Braço)
    const numbersRow = document.createElement('div');
    numbersRow.className = 'fret-numbers';
    for(let f=0; f<=15; f++) {
        const numDiv = document.createElement('div');
        numDiv.className = 'fret-number';
        if (f > 0) {
            numDiv.innerText = f;
            if ([3, 5, 7, 9, 12, 15].includes(f)) {
                numDiv.classList.add('marker');
            }
        }
        numbersRow.appendChild(numDiv);
    }
    board.appendChild(numbersRow);

    // 6. Gerar os Campos Harmónicos Inferiores
    const wrapper = document.getElementById('harmonic-sequences-wrapper');
    wrapper.innerHTML = ''; 

    if (mainType === 'major') {
        wrapper.appendChild(buildSequenceDom(rootIdx, 'major', 'Campo Harmónico Maior'));
    } else {
        wrapper.appendChild(buildSequenceDom(rootIdx, 'minorNatural', 'Campo Harmónico Menor Natural'));
        wrapper.appendChild(buildSequenceDom(rootIdx, 'minorHarmonic', 'Campo Harmónico Menor Harmónico'));
    }
}

// Inicializar a aplicação ao carregar
updateApp();