const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const notesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        let currentNotes = notesSharp; 
        
        const tuning = [4, 11, 7, 2, 9, 4]; 
        
        let showTetrads = false;
        let currentMinorType = 'minorNatural'; 

        const patterns = { 
            major: [0,2,4,5,7,9,11], 
            minorNatural: [0,2,3,5,7,8,10], 
            minorHarmonic: [0,2,3,5,7,8,11],
            minorMelodic: [0,2,3,5,7,9,11] 
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

        function toggleTetrads() {
            showTetrads = !showTetrads;
            document.getElementById('tetrad-btn').innerText = showTetrads ? "Tétrades" : "Tríades";
            document.getElementById('tetrad-btn').classList.toggle('active');
            updateApp();
        }

        function closeOverlay() { document.getElementById('chord-overlay').style.display = 'none'; }

        function setMinorType(type, btnElement) {
            currentMinorType = type;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btnElement.classList.add('active');
            updateApp();
        }

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
            
            // 1. Monta a base do acorde
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

            // =========================================================
            // MOTOR DE INTELIGÊNCIA DAS TÉTRADES
            // =========================================================
            if (showTetrads) {
                // Descobre matematicamente qual é o intervalo da 7ª do acorde
                let seventhInterval = 10; // Padrão: 7ª Menor
                if (suffix.includes('7M')) seventhInterval = 11;
                if (suffix.includes('dim7')) seventhInterval = 9;

                let targetNoteIdx = (rootIdx + seventhInterval) % 12;
                let bestOption = null;
                let bestScore = -9999;

                // Procura a melhor nota dentro do acorde para transformar na Sétima
                for (let i = 0; i < absoluteDots.length; i++) {
                    let dot = absoluteDots[i];
                    let str = dot.str;
                    if (str === map.rStr) continue; // Nunca altera a nota do Baixo

                    let originalNoteIdx = (stringNotes[str] + dot.fret) % 12;
                    let originalInterval = (originalNoteIdx - rootIdx + 12) % 12;

                    let minF = barreFret > 0 ? barreFret : 0;
                    let maxF = minF + 4; // Limita a abertura física dos dedos

                    for(let testF = minF; testF <= maxF; testF++) {
                        if ((stringNotes[str] + testF) % 12 === targetNoteIdx) {
                            let score = 0;
                            if (originalInterval === 0) score += 100; // Prioridade MÁXIMA: Substituir tônica duplicada
                            else if (originalInterval === 7) score += 50; // Plano B: Substituir a 5ª
                            else if (originalInterval === 6 || originalInterval === 8) score += 40; // Substituir 5ª alterada
                            else score -= 100; // Evita ao máximo substituir a terça

                            score += (str * 0.1); // Critério de desempate (cordas mais agudas)

                            if (score > bestScore) {
                                bestScore = score;
                                bestOption = { index: i, newFret: testF };
                            }
                        }
                    }
                }

                // Se encontrou um lugar fisicamente possível para colocar a 7ª, ele aplica
                if (bestOption) {
                    absoluteDots[bestOption.index].fret = bestOption.newFret;
                    absoluteDots[bestOption.index].isSeventh = true; 
                }
            }
            // =========================================================

            let startFret = barreFret;
            if (startFret <= 0) startFret = 1;
            let labelText = startFret > 1 ? startFret + 'ª' : '';

            let svg = `<svg width="100" height="135" viewBox="0 0 80 100">
                <text x="2" y="10" font-size="8" fill="#888">${labelText}</text>
                <rect x="15" y="15" width="50" height="70" fill="none" stroke="#444"/>`;

            if (startFret === 1) svg += `<line x1="15" y1="15" x2="65" y2="15" stroke="#d1d1d1" stroke-width="3.5"/>`;

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
                        // Destaca se a corda solta for tônica ou sétima
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
                    
                    // Colore as bolinhas
                    let fill = 'white';
                    if (isRoot) fill = 'var(--tonic)';
                    else if (d.isSeventh) fill = 'var(--altered)';

                    svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="${fill}"/>`;
                }
            });

            return svg + `</svg>`;
        }

        function openOverlay(name, note, suffix, idx, sType) {
            document.getElementById('modal-title').innerText = name;
            document.getElementById('modal-subtitle').innerText = `${idx+1}º Grau • ${harmonicFunctions[sType][idx]}`;
            const grid = document.getElementById('caged-grid'); grid.innerHTML = '';
            ['C', 'A', 'G', 'E', 'D'].forEach(m => {
                const item = document.createElement('div'); item.className = 'caged-item';
                item.innerHTML = `<label style="color:#555; font-size:0.6rem; display:block; margin-bottom:5px">MODELO ${m}</label>` + drawSVG(note, m, suffix);
                grid.appendChild(item);
            });

            // Desenha a Legenda Dinâmica do Modal
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

        // Dicionário para traduzir qualquer nota (sustenido ou bemol) para o índice matemático [0 a 11]
        const rootToIndex = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 
            'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11
        };

        function updateApp() {
            const root = document.getElementById('root-note').value;
            const mainType = document.getElementById('scale-type').value; 
            
            // Agora pegamos o índice usando o dicionário seguro
            const rootIdx = rootToIndex[root]; 
            
            // Inteligência automática: Se a nota escolhida tem 'b' ou é 'F', ou se for Menor em C, G, D, força o uso dos Bemóis
            let useFlats = root.includes('b') || root === 'F';
            if (mainType === 'minor' && ['C', 'G', 'D'].includes(root)) useFlats = true;
            
            currentNotes = useFlats ? notesFlat : notesSharp;

            const minorTabs = document.getElementById('minor-tabs');
            minorTabs.style.display = mainType === 'minor' ? 'flex' : 'none';

            const legendsWrap = document.getElementById('legends');
            const legHarm = document.getElementById('legend-harmonic');
            const legMel = document.getElementById('legend-melodic');

            if (mainType === 'minor' && currentMinorType !== 'minorNatural') {
                legendsWrap.style.display = 'flex';
                if (currentMinorType === 'minorHarmonic') {
                    legHarm.style.display = 'flex';
                    legMel.style.display = 'none';
                } else if (currentMinorType === 'minorMelodic') {
                    legHarm.style.display = 'flex';
                    legMel.style.display = 'flex';
                }
            } else {
                legendsWrap.style.display = 'none';
            }

            const fretboardType = mainType === 'major' ? 'major' : currentMinorType;
            
            const board = document.getElementById('fretboard'); board.innerHTML = '';
            tuning.forEach(s => {
                const row = document.createElement('div'); row.className = 'string';
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

            const wrapper = document.getElementById('harmonic-sequences-wrapper');
            wrapper.innerHTML = ''; 

            if (mainType === 'major') {
                wrapper.appendChild(buildSequenceDom(rootIdx, 'major', 'Campo Harmônico Maior'));
            } else {
                wrapper.appendChild(buildSequenceDom(rootIdx, 'minorNatural', 'Campo Harmônico Menor Natural'));
                wrapper.appendChild(buildSequenceDom(rootIdx, 'minorHarmonic', 'Campo Harmônico Menor Harmônico'));
            }
        }
        
        updateApp();