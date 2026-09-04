/* Estoque prototype */
(function () {
  var filter = 'all';
  var query = '';
  var selectedId = null;
  var pendingAction = null;

  var labels = {
    sementes: 'Sementes',
    quimicos: 'Químicos',
    biologicos: 'Biológicos',
    fertilizantes: 'Fertilizantes',
    corretivos: 'Corretivos'
  };

  function daysUntil(iso) {
    var d = new Date(iso);
    return Math.ceil((d - new Date()) / 86400000);
  }

  function filtered() {
    return FS_DATA.produtos.filter(function (p) {
      if (filter === 'critico' && !p.critico) return false;
      if (filter === 'validade') {
        var soon = p.lotes.some(function (l) { return daysUntil(l.validade) <= 30; });
        if (!soon) return false;
      } else if (filter !== 'all' && p.categoria !== filter) {
        return false;
      }
      if (query) {
        var q = query.toLowerCase();
        var hit = p.nome.toLowerCase().includes(q) ||
          p.lotes.some(function (l) { return l.codigo.toLowerCase().includes(q); });
        if (!hit) return false;
      }
      return true;
    });
  }

  function renderTable() {
    var body = document.getElementById('estoqueBody');
    var rows = filtered();
    body.innerHTML = rows.map(function (p) {
      var status = p.critico
        ? '<span class="badge badge-risk">Crítico</span>'
        : (p.lotes.some(function (l) { return daysUntil(l.validade) <= 30; })
          ? '<span class="badge badge-warn">Validade</span>'
          : '<span class="badge badge-ok">OK</span>');
      return '<tr data-id="' + p.id + '" class="' + (selectedId === p.id ? 'is-active' : '') + '">' +
        '<td><strong>' + p.nome + '</strong></td>' +
        '<td>' + (labels[p.categoria] || p.categoria) + '</td>' +
        '<td class="num">' + p.saldo.toLocaleString('pt-BR') + ' ' + p.unidade + '</td>' +
        '<td>' + p.lotes.length + '</td>' +
        '<td>' + p.galpao + '</td>' +
        '<td class="num">R$ ' + p.custoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td>' +
        '<td>' + status + '</td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="7">Nenhum produto neste filtro.</td></tr>';

    body.querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        openProduct(tr.getAttribute('data-id'));
      });
    });
  }

  function openProduct(id) {
    selectedId = id;
    var p = FS_DATA.produtos.find(function (x) { return x.id === id; });
    if (!p) return;
    renderTable();
    document.getElementById('drawerTitle').textContent = p.nome;
    document.getElementById('drawerSub').textContent =
      p.fazenda + ' · Galpão ' + p.galpao + ' · mín. ' + p.minimo + ' ' + p.unidade;

    var lotesHtml = p.lotes.map(function (l) {
      var dias = daysUntil(l.validade);
      var badge = dias <= 30 ? ' badge-warn' : ' badge-neutral';
      return '<div class="lot-row"><div><strong>' + l.codigo + '</strong><br><span class="badge' + badge + '">val. ' +
        l.validade.split('-').reverse().join('/') + '</span></div><div class="num">' +
        l.saldo + ' ' + p.unidade + '<br><small>R$ ' + l.custo.toFixed(2) + '</small></div></div>';
    }).join('');

    var movHtml = (p.movimentacoes.length
      ? p.movimentacoes.map(function (m) {
        return '<div class="lot-row"><div><strong>' + m.tipo + '</strong><br><span style="color:var(--fs-gray);font-size:0.75rem">' +
          m.data + ' · ' + m.dest + '</span></div><div class="num">' + m.qtd + '</div></div>';
      }).join('')
      : '<p style="color:var(--fs-gray);font-size:0.8rem">Sem movimentações recentes.</p>');

    var appHtml = (p.aplicacoes.length
      ? p.aplicacoes.map(function (a) {
        return '<div class="lot-row"><div><strong>' + a.talhao + '</strong><br><span style="color:var(--fs-gray);font-size:0.75rem">' +
          a.data + ' · ' + a.safra + ' · ' + a.ha + ' ha</span></div><div class="num">R$ ' +
          a.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</div></div>';
      }).join('')
      : '<p style="color:var(--fs-gray);font-size:0.8rem">Sem aplicações vinculadas.</p>');

    document.getElementById('drawerBody').innerHTML =
      '<div class="detail-section"><div class="metric"><span class="metric-label">Saldo atual</span>' +
      '<span class="metric-value">' + p.saldo + ' <span class="metric-unit">' + p.unidade + '</span></span></div></div>' +
      '<div class="detail-section"><h4>Lotes</h4>' + lotesHtml + '</div>' +
      '<div class="detail-section"><h4>Movimentações</h4>' + movHtml + '</div>' +
      '<div class="detail-section"><h4>Aplicações relacionadas</h4>' + appHtml + '</div>' +
      '<p style="font-size:0.75rem;color:var(--fs-gray)">Rastreio: produto → lote → fazenda → galpão → movimentação → aplicação → talhão → safra → custo</p>';

    FS.openDrawer('produtoDrawer');
  }

  function openAction(type) {
    pendingAction = type;
    var titles = {
      receber: 'Receber produto',
      transferir: 'Transferir entre galpões',
      aplicar: 'Separar / aplicar',
      inventario: 'Realizar inventário'
    };
    document.getElementById('modalTitle').textContent = titles[type] || 'Movimentação';

    var options = FS_DATA.produtos.map(function (p) {
      return '<option value="' + p.id + '"' + (selectedId === p.id ? ' selected' : '') + '>' + p.nome + '</option>';
    }).join('');

    var extra = '';
    if (type === 'transferir') {
      extra = '<div class="fs-field"><label>Destino</label><select class="fs-select"><option>Galpão Norte</option><option>Galpão Central</option></select></div>';
    } else if (type === 'aplicar') {
      extra = '<div class="fs-field"><label>Talhão</label><select class="fs-select">' +
        FS_DATA.talhoes.map(function (t) { return '<option>' + t.nome + ' (' + t.areaHa + ' ha)</option>'; }).join('') +
        '</select></div>';
    } else if (type === 'inventario') {
      extra = '<div class="fs-field"><label>Quantidade contada</label><input class="fs-input" type="number" min="0" step="0.01" placeholder="Saldo físico" /></div>';
    }

    document.getElementById('modalBody').innerHTML =
      '<div class="fs-field"><label>Produto</label><select class="fs-select" id="modalProduto">' + options + '</select></div>' +
      '<div class="fs-field"><label>Quantidade</label><input class="fs-input" type="number" min="0" step="0.01" value="10" /></div>' +
      '<div class="fs-field"><label>Lote</label><input class="fs-input" type="text" placeholder="Código do lote" value="AUTO-' + Date.now().toString().slice(-4) + '" /></div>' +
      extra +
      '<p style="font-size:0.75rem;color:var(--fs-gray);margin-top:0.5rem">Protótipo: a movimentação é simulada em memória nesta sessão.</p>';

    FS.openModal('acaoModal');
  }

  document.addEventListener('DOMContentLoaded', function () {
    FS.initShell('estoque');
    renderTable();

    document.getElementById('estoqueFilters').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-filter]');
      if (!chip) return;
      filter = chip.getAttribute('data-filter');
      document.querySelectorAll('#estoqueFilters .filter-chip').forEach(function (c) {
        c.classList.toggle('is-active', c === chip);
      });
      renderTable();
    });

    document.getElementById('estoqueSearch').addEventListener('input', function (e) {
      query = e.target.value;
      renderTable();
    });

    document.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openAction(btn.getAttribute('data-action'));
      });
    });

    document.getElementById('modalConfirm').addEventListener('click', function () {
      var names = { receber: 'Recebimento', transferir: 'Transferência', aplicar: 'Separação', inventario: 'Inventário' };
      FS.closeModal('acaoModal');
      FS.toast((names[pendingAction] || 'Movimentação') + ' registrada (simulação)');
    });
  });
})();
