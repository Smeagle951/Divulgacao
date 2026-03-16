// formatDate Helper
function formatDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

// formatDateTime Helper
function formatDateTime(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Fetch and Render Data
document.addEventListener("DOMContentLoaded", () => {
    const reportContent = document.getElementById('report-content');
    const showContent = () => { reportContent.style.opacity = '1'; };

    fetch('dados.json')
        .then(response => {
            if (!response.ok) throw new Error('Arquivo não encontrado');
            return response.json();
        })
        .then(data => {
            renderDashboard(data);
            showContent();
        })
        .catch(err => {
            console.error("Erro ao carregar o JSON:", err);
            document.getElementById('bind-org-name').textContent = "Erro ao carregar dados";
            document.getElementById('bind-user-name').textContent = "—";
            document.getElementById('bind-user-role').textContent = "Abra por um servidor web (não file://)";
            showContent();
            showLoadError();
        });
});

function showLoadError() {
    const el = document.getElementById('report-content');
    const msg = document.createElement('div');
    msg.className = 'load-error-msg';
    msg.innerHTML = '<strong>Dados não carregados.</strong> Use um servidor web (ex.: abrir a pasta no VS Code e usar "Live Server") para o <code>dados.json</code> ser carregado.';
    el.insertBefore(msg, el.firstChild);
}

function renderDashboard(data) {
    // 1. Sidebar
    const appNameEl = document.getElementById('bind-app-name');
    if (appNameEl) appNameEl.textContent = 'FortSmart';
    document.getElementById('bind-org-name').textContent = data.enterprise_metadata.organization.name;
    const mobileOrg = document.getElementById('bind-mobile-org');
    if (mobileOrg) mobileOrg.textContent = data.enterprise_metadata.organization.name;
    document.getElementById('bind-user-avatar').textContent = data.report.created_by.avatar_initials || 'US';
    document.getElementById('bind-user-name').textContent = data.report.created_by.name;
    document.getElementById('bind-user-role').textContent = data.report.created_by.role + (data.report.created_by.crea ? ` · ${data.report.created_by.crea}` : '');

    // 2. Header
    document.getElementById('bind-bc-farm').textContent = data.property_structure.farm.name;
    document.getElementById('bind-bc-field').textContent = data.property_structure.field.name;
    document.getElementById('bind-status-text').textContent = data.report.status.toUpperCase();
    document.getElementById('bind-status-badge').className = `status-badge ${data.report.status.toLowerCase()}`;
    document.getElementById('bind-version').textContent = 'v' + data.report.version;
    document.getElementById('bind-report-id').textContent = data.report.report_id;

    // 3. Resumo Top
    document.getElementById('bind-emit-info').innerHTML = `Emitido em ${formatDateTime(data.report.created_at)} · Aprovado por ${data.report.approved_by.name}`;
    document.getElementById('tag-crop').textContent = `${data.crop_cycle.crop} — ${data.crop_cycle.season}`;
    document.getElementById('tag-location').textContent = `📍 ${data.property_structure.farm.city} · ${data.property_structure.farm.state}`;
    document.getElementById('tag-area').textContent = `📐 ${data.property_structure.field.area_hectares} ha · ${data.property_structure.field.name}`;
    document.getElementById('tag-stage').textContent = `🌱 ${data.crop_cycle.phenological_stage} — ${data.crop_cycle.days_after_emergence} DAE`;
    document.getElementById('tag-hybrid').textContent = `Híbrido: ${data.crop_cycle.hybrid}`;
    document.getElementById('tag-plan').textContent = `Plano: ${data.enterprise_metadata.organization.subscription_plan}`;

    // Risco Badge
    document.getElementById('bind-risk-score').textContent = data.risk_evaluation.overall_risk_score;
    document.getElementById('bind-risk-level').textContent = `Risco ${data.risk_evaluation.risk_level.charAt(0).toUpperCase() + data.risk_evaluation.risk_level.slice(1)}`;
    document.getElementById('bind-risk-badge').className = `risk-badge ${data.risk_evaluation.risk_level}`;
    document.getElementById('bind-next-visit').textContent = `Próxima visita: ${formatDate(data.risk_evaluation.next_recommended_visit)}`;

    // 4. Propriedade & Safra
    document.getElementById('prop-farm').textContent = data.property_structure.farm.name;
    document.getElementById('prop-city').textContent = `${data.property_structure.farm.city} — ${data.property_structure.farm.state}`;
    document.getElementById('prop-total-area').textContent = `${data.property_structure.farm.total_area_hectares} ha`;
    document.getElementById('prop-field').textContent = `${data.property_structure.field.name} (${data.property_structure.field.area_hectares} ha)`;
    document.getElementById('prop-soil').textContent = data.property_structure.field.soil_type;
    document.getElementById('prop-irrigation').textContent = data.property_structure.field.irrigation ? 'Sim' : 'Não';
    document.getElementById('prop-prev-crop').textContent = data.property_structure.field.previous_crop;

    document.getElementById('cycle-season').textContent = data.crop_cycle.season;
    document.getElementById('cycle-crop').textContent = data.crop_cycle.crop;
    document.getElementById('cycle-hybrid').textContent = data.crop_cycle.hybrid;
    document.getElementById('cycle-sow').textContent = formatDate(data.crop_cycle.sowing_date);
    document.getElementById('cycle-emergence').textContent = formatDate(data.crop_cycle.emergence_date);
    document.getElementById('cycle-dae').textContent = `${data.crop_cycle.days_after_emergence} dias`;
    document.getElementById('cycle-stage').textContent = data.crop_cycle.phenological_stage;

    // 5. Monitoramento
    document.getElementById('mon-method').textContent = data.monitoring.monitoring_method;
    document.getElementById('mon-points').textContent = data.monitoring.sample_points;
    document.getElementById('mon-temp').textContent = `${data.monitoring.climate_conditions.temperature_celsius}°C`;
    document.getElementById('mon-humidity').innerHTML = `${data.monitoring.climate_conditions.humidity_percent}<span style="font-size:1rem">%</span>`;
    document.getElementById('mon-notes').innerHTML = `📝 <strong>Observações gerais:</strong> ${data.monitoring.general_notes}`;

    // 6. Pragas (Iterando Array e Gerando HTML Dinâmico)
    const pestContainer = document.getElementById('pest-container');
    pestContainer.innerHTML = ''; // limpar container

    data.pest_analysis.forEach(pest => {
        const trendIcon = pest.historical_comparison.trend === 'aumento' ? '▲' : '▼';
        const trendClass = pest.historical_comparison.trend === 'aumento' ? 'aumento' : 'reducao';
        const signalText = pest.historical_comparison.variation_percent > 0 ? '+' : '';

        const iconBadge = pest.severity_level === 'baixo' ? '✓' : '⚠️';
        const deadlineClass = pest.severity_level === 'baixo' ? 'priority-low' : '';

        const html = `
            <div class="pest-card">
                <div class="pest-header">
                    <div>
                        <div class="pest-name">🔍 ${pest.common_name}</div>
                        <div class="pest-cat">${pest.category.toUpperCase()} · ${pest.incidence_metrics.distribution_pattern}</div>
                    </div>
                    <span class="severity-badge ${pest.severity_level}">${iconBadge} ${pest.severity_level.toUpperCase()}</span>
                </div>
                <div class="pest-metrics">
                    <div class="pest-metric">
                        <div class="pest-metric-val">${pest.incidence_metrics.average_per_sample_point}</div>
                        <div class="pest-metric-lbl">méd./ponto</div>
                    </div>
                    <div class="pest-metric">
                        <div class="pest-metric-val">${pest.incidence_metrics.affected_plants_percent}%</div>
                        <div class="pest-metric-lbl">plantas afet.</div>
                    </div>
                    <div class="pest-metric" style="grid-column: 1 / -1;">
                        <div class="pest-metric-val" style="font-size:1rem; line-height:1.4;">${pest.damage_description}</div>
                        <div class="pest-metric-lbl">dano observado</div>
                    </div>
                </div>
                <div class="info-row">
                    <span class="info-label">Safra anterior (mesmo estágio)</span>
                    <span class="info-value">${pest.historical_comparison.last_season_same_stage_incidence_percent}%</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Variação</span>
                    <span class="info-value"><span class="trend-pill ${trendClass}">${trendIcon} ${signalText}${pest.historical_comparison.variation_percent}%</span></span>
                </div>
                <div class="info-row" style="margin-top:0.5rem">
                    <span class="info-label">Limiar econômico atingido?</span>
                    <span class="info-value" style="color: ${pest.economic_threshold_reached ? 'var(--danger)' : 'var(--success)'}; font-weight:bold;">
                        ${pest.economic_threshold_reached ? '⚠️ SIM' : '✓ NÃO'}
                    </span>
                </div>
                <div class="action-bar ${deadlineClass}">
                    <div>
                        <div class="action-type">${pest.recommended_action.type}</div>
                        <div class="action-deadline">Retorno em até ${pest.recommended_action.deadline_days} dias</div>
                    </div>
                    <span class="severity-badge ${pest.severity_level}">${pest.recommended_action.deadline_days} d</span>
                </div>
            </div>
        `;
        pestContainer.innerHTML += html;
    });

    // 7. Risco & Insights
    const score = data.risk_evaluation.overall_risk_score;
    document.getElementById('main-gauge-score').textContent = score;
    document.getElementById('main-gauge-subtitle').innerHTML = `Risco <strong>${data.risk_evaluation.risk_level.toUpperCase()}</strong>`;

    // Animação do SVG Gauge (circunferência = 314 px)
    const percentage = score / 100;
    const offset = 314 - (percentage * 314);
    const gaugeFill = document.getElementById('gauge-fill');
    gaugeFill.style.strokeDashoffset = offset;
    gaugeFill.className.baseVal = `gauge-fill ${data.risk_evaluation.risk_level}`;

    // Insights Array
    const insightsContainer = document.getElementById('insights-container');
    insightsContainer.innerHTML = '';
    data.decision_support.data_driven_insights.forEach(insight => {
        insightsContainer.innerHTML += `
            <div class="insight-item">
                <span class="insight-icon">${insight.icon}</span>
                <span class="insight-text">${insight.html_text}</span>
            </div>
        `;
    });

    // 8. Footer
    document.getElementById('footer-hash').textContent = data.digital_security.hash_sha256;
    document.getElementById('footer-text').textContent = `v${data.enterprise_metadata.system_version} · Plano ${data.enterprise_metadata.organization.subscription_plan} · ${data.enterprise_metadata.organization.name}`;
}

// Active nav on scroll
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-item');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { threshold: 0.3 });

// Only watch sections inside page-content:
document.querySelectorAll('.page-content > div[id]').forEach(s => observer.observe(s));
