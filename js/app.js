/* Utilities */
function qs(sel, root = document) { return root.querySelector(sel) }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }

/* Tema */
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    localStorage.setItem('darkTheme', body.classList.contains('dark'));
}
function loadTheme() {
    if (localStorage.getItem('darkTheme') === 'true') document.body.classList.add('dark');
}

/* Menu */
function toggleMenu() { qs('.nav').classList.toggle('active') }

/* Tecnologias - dados iniciais (linguagem simples) */
const TECHS = [
    { name: 'React', cat: 'frontend', level: 'intermediário', desc: 'Biblioteca para criar interfaces usando componentes reutilizáveis.', pros: ['componentes reutilizáveis','grande comunidade'], cons: ['tamanho do bundle','curva conceitual'], when: ['Você precisa de UIs dinâmicas', 'Projeto grande com muitos estados', 'Prefere ecossistema amplo'], url: 'https://reactjs.org' },
    { name: 'Vue', cat: 'frontend', level: 'intermediário', desc: 'Framework leve e simples para construir interfaces reativas.', pros: ['fácil de aprender','reatividade simples'], cons: ['menor mercado que React'], when: ['Começo rápido em projetos pequenos/ médios', 'prefere simplicidade'], url: 'https://vuejs.org' },
    { name: 'Angular', cat: 'frontend', level: 'avançado', desc: 'Framework completo com muitas ferramentas integradas.', pros: ['estrutura completa','padronização'], cons: ['curva alta','mais verboso'], when: ['Aplicações empresariais grandes', 'necessita de uma arquitetura definida'], url: 'https://angular.io' },
    { name: 'Node.js', cat: 'backend', level: 'intermediário', desc: 'Permite rodar JavaScript no servidor para APIs e serviços.', pros: ['mesma linguagem no front/back','ecosistema npm'], cons: ['single-threaded (cuidado com CPU heavy)'], when: ['APIs rápidas em JS','fullstack JS'], url: 'https://nodejs.org' },
    { name: 'Django', cat: 'backend', level: 'intermediário', desc: 'Framework Python com ferramentas prontas para sites e APIs.', pros: ['rápido para prototipar','admin automático'], cons: ['pode ser monolítico'], when: ['Projetos com requisitos prontos do backend','rapidez de entrega'], url: 'https://www.djangoproject.com' },
    { name: 'MySQL', cat: 'db', level: 'básico', desc: 'Banco de dados relacional estável e conhecido.', pros: ['maturidade','ferramentas'], cons: ['escala vertical'], when: ['dados relacionais','transações'], url: 'https://www.mysql.com' },
    { name: 'PostgreSQL', cat: 'db', level: 'intermediário', desc: 'Banco relacional poderoso com muitos recursos.', pros: ['recursos avançados','bom para dados complexos'], cons: ['configuração inicial'], when: ['quando precisar de consultas complexas','consistência'], url: 'https://www.postgresql.org' },
    { name: 'MongoDB', cat: 'db', level: 'básico', desc: 'Banco NoSQL orientado a documentos, flexível no esquema.', pros: ['flexível','boa para protótipos'], cons: ['consistência eventual em alguns casos'], when: ['quando o esquema muda com frequência','dados semiestruturados'], url: 'https://www.mongodb.com' },
    { name: 'Docker', cat: 'devops', level: 'intermediário', desc: 'Ferramenta para empacotar aplicações e dependências em containers.', pros: ['ambiente igual em dev/prod','portabilidade'], cons: ['tem uma curva para aprender'], when: ['quando precisa de ambientes reproduzíveis','deploy em containers'], url: 'https://www.docker.com' },
    { name: 'Jest', cat: 'testes', level: 'básico', desc: 'Framework de testes para JavaScript, simples de configurar.', pros: ['fácil de rodar','bom para testes unitários'], cons: ['algumas configurações extras para testes complexos'], when: ['testes unitários em projetos JS','mock de módulos simples'], url: 'https://jestjs.io' }
];

/* Render de cards */
function renderTechs(list) {
    const grid = qs('#techGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(t => {
        const div = document.createElement('div');
        div.className = 'card tech-card';
        div.tabIndex = 0;
        div.innerHTML = `<h3>${t.name} <button class="fav" aria-label="Favoritar" data-name="${t.name}">☆</button></h3>
            <p>${t.desc}</p>
            <p><strong>Categoria:</strong> ${t.cat} • <strong>Nível:</strong> ${t.level}</p>
            <p><strong>Prós:</strong> ${t.pros.join(', ')}</p>
            <p><strong>Contras:</strong> ${t.cons.join(', ')}</p>
            <button class="btn-primary detail" data-name="${t.name}">Ver mais</button>`;
        grid.appendChild(div);
    });
}

function applyFilter() {
    const val = getActiveFilterValue();
    localStorage.setItem('lastFilter', val);
    renderTechs(getFilteredTechs());
}

function getActiveFilterValue(){
    const active = document.querySelector('.filter-button.active');
    return active ? active.dataset.filter : 'all';
}

function getFilteredTechs(){
    const val = getActiveFilterValue();
    const search = (qs('#techSearch')?.value || '').toLowerCase();
    let filtered = TECHS.filter(t => val === 'all' ? true : t.cat === val);
    if (search) filtered = filtered.filter(t => (t.name + ' ' + t.desc).toLowerCase().includes(search));
    return filtered;
}

function openModal(title, body, list=[]) {
    const modal = qs('#techModal');
    if (!modal) return;
    qs('#modalTitle').textContent = title;
    qs('#modalBody').textContent = body;
    const ul = qs('#modalList'); ul.innerHTML = '';
    list.forEach(it => { const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
    modal.setAttribute('aria-hidden','false');
}
function closeModal() { const m = qs('#techModal'); if(m) m.setAttribute('aria-hidden','true') }

function exportCsv(list) {
    if (!list) list = getFilteredTechs();
    const rows = [['Nome','Categoria','Prós','Contras']].concat(list.map(t => [t.name,t.cat,t.pros.join(';'),t.cons.join(';')]));
    const csv = rows.map(r => r.map(c=> '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tecnologias.csv'; a.click(); URL.revokeObjectURL(url);
}

/* Accordion */
function setupAccordion() {
    qsa('.accordion-item').forEach(item => {
        const title = item.querySelector('.accordion-title');
        title.addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });
}

/* Checklist */
function loadChecklist() {
    qsa('#personalChecklist input[type="checkbox"]').forEach( cb => {
        const key = cb.dataset.key; if(!key) return;
        cb.checked = localStorage.getItem('check_'+key) === 'true';
        cb.addEventListener('change', () => { localStorage.setItem('check_'+key, cb.checked); updateProgress(); });
    });
    updateProgress();
}
function updateProgress() {
    const boxes = qsa('#personalChecklist input[type="checkbox"]');
    const done = boxes.filter(b=>b.checked).length; const pct = Math.round((done/boxes.length)*100) || 0; qs('#checkProgress').textContent = pct + '%';
}

/* Fluxo tooltip */
function setupFlow() {
    const details = {
        'Descoberta': { title: 'Descoberta', desc: 'Entregáveis: pesquisas, entrevistas, mapa de empatia. Riscos: escopo mal definido.' },
        'Requisitos': { title: 'Requisitos', desc: 'Entregáveis: backlog, histórias, critérios de aceitação. Riscos: requisitos vagos.' },
        'Protótipo': { title: 'Protótipo', desc: 'Entregáveis: wireframes, protótipos navegáveis. Riscos: validação insuficiente.' },
        'Design': { title: 'Design', desc: 'Entregáveis: sistema de design, assets, especificações. Riscos: falta de consistência.' },
        'Implementação': { title: 'Implementação', desc: 'Entregáveis: código, testes unitários. Riscos: dívida técnica.' },
        'Testes': { title: 'Testes', desc: 'Entregáveis: planos de teste, relatórios. Riscos: cobertura insuficiente.' }
    };
    qsa('.flow-box').forEach(box => box.addEventListener('click', (e)=>{
        const step = box.dataset.step; const tip = qs('#flowTooltip');
        tip.textContent = details[step]?.desc || step;
        tip.style.left = (e.pageX + 10) + 'px'; tip.style.top = (e.pageY + 10) + 'px';
        tip.classList.add('show'); tip.setAttribute('aria-hidden','false');
        qs('#flowTitle').textContent = details[step]?.title || step; qs('#flowDesc').textContent = details[step]?.desc || '';
        setTimeout(()=>{ tip.classList.remove('show'); tip.setAttribute('aria-hidden','true') },4000);
    }));
    qsa('.timeline-step').forEach(el => el.addEventListener('click', ()=>{
        const step = el.dataset.step; qs('#flowTitle').textContent = details[step].title; qs('#flowDesc').textContent = details[step].desc;
    }));
}

/* Quiz */
const QUESTIONS = [
    { q: 'Qual é o papel principal do HTML?', a: ['Estruturar o conteúdo da página','Estilizar textos e cores','Executar lógica no navegador','Gerenciar banco de dados'], correct:0, explain:'HTML fornece a estrutura e semântica — títulos, parágrafos, listas e landmarks.' },
    { q: 'Qual é o papel principal do CSS?', a: ['Criar a estrutura do documento','Estilizar aparência (cores, layout, tipografia)','Adicionar interatividade','Comunicar com servidores'], correct:1, explain:'CSS controla aparência: layout, cores, espaçamento e responsividade.' },
    { q: 'Qual é o papel principal do JavaScript?', a: ['Validar HTML automaticamente','Adicionar comportamento e interatividade','Substituir CSS','Criar imagens'], correct:1, explain:'JS manipula o DOM, responde a eventos e traz interatividade.' },
    { q: 'Qual destas é uma boa prática de acessibilidade?', a: ['Remover outlines para ficar bonito','Adicionar textos alternativos (alt) em imagens','Usar apenas divs sem semantic tags','Desabilitar navegação por teclado'], correct:1, explain:'Alt descritivo e uso de tags semânticas ajudam quem usa leitores de tela e navegação por teclado.' },
    { q: 'O que significa mobile-first?', a: ['Fazer site só para celulares','Desenvolver pensando primeiro em telas pequenas e escalar para desktop','Ignorar desktop','Fazer duas versões separadas do site'], correct:1, explain:'Mobile-first é estratégias CSS que começam em telas pequenas e adicionam regras para telas maiores.' },
    { q: 'Quando preferir um banco relacional (ex: PostgreSQL)?', a: ['Quando dados são altamente relacionais e precisam de transações','Quando o esquema muda a cada requisição','Quando só precisa de cache simples','Quando não existe servidor'], correct:0, explain:'Bancos relacionais são ideais para dados estruturados, integridade e consultas complexas.' },
    { q: 'Qual é a vantagem de usar testes automatizados?', a: ['Aumentar confiança ao mudar código','Deixar o site mais bonito','Substituir revisão de código','Fazer deploy manualmente'], correct:0, explain:'Testes ajudam detectar regressões e facilitar refatorações seguras.' },
    { q: 'Por que não guardar segredos no localStorage?', a: ['Porque é criptografado automaticamente','Porque é acessível via console e não seguro para segredos','Porque sincroniza com o servidor','Porque ocupa pouco espaço'], correct:1, explain:'localStorage é visível ao usuário e a scripts na página; não é seguro para tokens secretos.' }
];
let quizState = { idx:0, score:0, best: Number(localStorage.getItem('bestScore')||0) };

function renderQuestion() {
    const boxQ = qs('#questionBox'); const boxA = qs('#answersBox'); const res = qs('#result');
    if (!boxQ) return;
    const cur = QUESTIONS[quizState.idx];
    boxQ.textContent = `(${quizState.idx+1}/${QUESTIONS.length}) ${cur.q}`;
    boxA.innerHTML = '';
    cur.a.forEach((opt,i)=>{
        const btn = document.createElement('button'); btn.className='btn-primary'; btn.textContent = opt; btn.dataset.i = i;
        btn.addEventListener('click', ()=>{
            const all = qsa('#answersBox button'); all.forEach(b=>b.disabled=true);
            if (i===cur.correct){ quizState.score++; res.textContent='✅ Correto: '+cur.explain } else { res.textContent='❌ Errado: '+cur.explain }
        });
        boxA.appendChild(btn);
    });
}

function nextQuestion() {
    quizState.idx++;
    if (quizState.idx >= QUESTIONS.length) {
        finishQuiz(); return;
    }
    renderQuestion();
}
function finishQuiz() {
    qs('#quizApp').innerHTML = `<h3>Resultado: ${quizState.score}/${QUESTIONS.length}</h3><p>Melhor: ${quizState.best}</p>`;
    if (quizState.score > quizState.best) { localStorage.setItem('bestScore', quizState.score); }
}

/* Shortcuts */
function setupShortcuts(){
    document.addEventListener('keydown', (e)=>{
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); qs('#techSearch')?.focus(); }
        if (e.altKey && e.key.toLowerCase() === 'm') { e.preventDefault(); qs('.menu-toggle')?.click(); }
        if (e.key === 'Home') window.scrollTo({ top:0, behavior:'smooth' });
    });
}

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
    loadTheme();
    qs('#themeToggle')?.addEventListener('click', toggleTheme);
    qs('.menu-toggle')?.addEventListener('click', toggleMenu);
    qsa('.nav a').forEach(a=> a.addEventListener('click', ()=>{ if(window.innerWidth<=768) toggleMenu(); }));

    // Techs
    renderTechs(TECHS);
    // filtros via botões
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-button').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false') });
            btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
            const val = btn.dataset.filter; localStorage.setItem('lastFilter', val); applyFilter();
        });
    });
    qs('#techSearch')?.addEventListener('input', applyFilter);
    // restore last filter
    const last = localStorage.getItem('lastFilter'); if (last) {
        const target = document.querySelector(`.filter-button[data-filter="${last}"]`);
        if (target) { target.classList.add('active'); target.setAttribute('aria-pressed','true') }
    }
    // detail and modal delegation
    document.addEventListener('click', (e)=>{
            if (e.target.matches('.detail')){
                const name = e.target.dataset.name; const t = TECHS.find(x=>x.name===name);
                openModal(t.name, t.desc, t.when || []);
            }
        if (e.target.matches('.modal-close') || e.target.closest('.modal[aria-hidden="false"]')){
            if (e.target.matches('.modal-close')) closeModal();
        }
    if (e.target.matches('#exportCsv')) { exportCsv(); }
        if (e.target.matches('.fav')) { const n=e.target.dataset.name; e.target.textContent = '★'; }
    });

    qs('#techModal')?.addEventListener('click', (e)=>{ if (e.target === qs('#techModal')) closeModal(); });

    setupAccordion(); loadChecklist(); setupFlow(); setupShortcuts();

    // Quiz
    if (qs('#questionBox')) { renderQuestion(); qs('#nextBtn')?.addEventListener('click', nextQuestion); }
});

