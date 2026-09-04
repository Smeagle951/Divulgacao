/* Prescrição prototype — single-screen calc */
(function () {
  var selectedTalhoes = { t07: true, t12: true };
  var lines = [
    { catalogId: 'p6', dose: 0.3, ordem: 1 },
    { catalogId: 'adj1', dose: 0.5, ordem: 2 }
  ];

  function catalogItem(id) {
    return FS_DATA.catalogoPrescricao.find(function (c) { return c.id === id; });
  }

  function areaHa() {
    return FS_DATA.talhoes.reduce(function (sum, t) {
      return selectedTalhoes[t.id] ? sum + t.areaHa : sum;
    }, 0);
  }

  function renderTalhoes() {
    document.getElementById('talhaoChecks').innerHTML = FS_DATA.talhoes.map(function (t) {
      return '<label class="talhao-check"><input type="checkbox" data-talhao="' + t.id + '"' +
        (selectedTalhoes[t.id] ? ' checked' : '') + ' /> ' + t.nome +
        ' <span style="color:var(--fs-gray);margin-left:auto">' + t.areaHa + ' ha</span></label>';
    }).join('');

    document.querySelectorAll('[data-talhao]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        selectedTalhoes[cb.getAttribute('data-talhao')] = cb.checked;
        recalc();
      });
    });
  }

  function renderProducts() {
    var cat = FS_DATA.catalogoPrescricao;
    document.getElementById('productRows').innerHTML = lines.map(function (line, idx) {
      var opts = cat.map(function (c) {
        return '<option value="' + c.id + '"' + (c.id === line.catalogId ? ' selected' : '') + '>' +
          c.nome + '</option>';
      }).join('');
      var item = catalogItem(line.catalogId);
      return '<div class="product-row" data-idx="' + idx + '">' +
        '<div class="fs-field" style="margin:0"><label>Produto</label><select class="fs-select js-prod">' + opts + '</select></div>' +
        '<div class="fs-field" style="margin:0"><label>Dose / ha</label><input class="fs-input js-dose" type="number" min="0" step="0.01" value="' + line.dose + '" /></div>' +
        '<div class="fs-field" style="margin:0"><label>Unidade</label><input class="fs-input" readonly value="' + (item ? item.unidade : '') + '" /></div>' +
        '<div class="fs-field" style="margin:0"><label>Ordem</label><input class="fs-input js-ordem" type="number" min="1" value="' + line.ordem + '" /></div>' +
        '<button type="button" class="btn btn-ghost btn-sm js-remove" aria-label="Remover">×</button>' +
        '</div>';
    }).join('');

    document.querySelectorAll('.product-row').forEach(function (row) {
      var idx = +row.getAttribute('data-idx');
      row.querySelector('.js-prod').addEventListener('change', function (e) {
        lines[idx].catalogId = e.target.value;
        var it = catalogItem(e.target.value);
        if (it) lines[idx].dose = it.dosePadrao;
        renderProducts();
        recalc();
      });
      row.querySelector('.js-dose').addEventListener('input', function (e) {
        lines[idx].dose = parseFloat(e.target.value) || 0;
        recalc();
      });
      row.querySelector('.js-ordem').addEventListener('input', function (e) {
        lines[idx].ordem = parseInt(e.target.value, 10) || 1;
      });
      row.querySelector('.js-remove').addEventListener('click', function () {
        lines.splice(idx, 1);
        renderProducts();
        recalc();
      });
    });
  }

  function recalc() {
    var ha = areaHa();
    document.getElementById('areaTotal').textContent = ha.toLocaleString('pt-BR');

    var caldaLha = parseFloat(document.getElementById('caldaLha').value) || 100;
    var tanqueL = parseFloat(document.getElementById('tanqueL').value) || 2000;
    var seg = (parseFloat(document.getElementById('segurancaPct').value) || 0) / 100;

    var volumeTotal = ha * caldaLha * (1 + seg);
    var haPorTanque = tanqueL / caldaLha;
    var caldas = ha > 0 ? Math.ceil(ha / haPorTanque) : 0;

    var custoTotal = 0;
    var productLines = lines.map(function (line) {
      var item = catalogItem(line.catalogId);
      if (!item) return null;
      var qtd = line.dose * ha;
      var custo = qtd * item.custo;
      custoTotal += custo;
      var ok = qtd <= item.estoque;
      return {
        nome: item.nome,
        unidade: item.unidade,
        qtd: qtd,
        estoque: item.estoque,
        ok: ok,
        custo: custo,
        dose: line.dose
      };
    }).filter(Boolean);

    var custoHa = ha > 0 ? custoTotal / ha : 0;

    var html = '';
    html += '<div class="calc-row"><span>Área tratada</span><strong>' + ha + ' ha</strong></div>';
    html += '<div class="calc-row"><span>Volume total (+ segurança)</span><strong>' + volumeTotal.toFixed(0) + ' L</strong></div>';
    html += '<div class="calc-row"><span>Hectares / tanque</span><strong>' + haPorTanque.toFixed(1) + ' ha</strong></div>';
    html += '<div class="calc-row"><span>Caldas necessárias</span><strong>' + caldas + '</strong></div>';

    productLines.forEach(function (p) {
      html += '<div class="calc-row ' + (p.ok ? 'is-ok' : 'is-risk') + '"><span>' + p.nome +
        '<br><small style="color:var(--fs-gray)">' + p.dose + ' ' + p.unidade + '/ha</small></span><strong>' +
        p.qtd.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' ' + p.unidade + '</strong></div>';
    });

    html += '<div class="calc-row"><span>Custo / ha</span><strong>R$ ' +
      custoHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</strong></div>';
    html += '<div class="calc-row"><span>Custo total</span><strong>R$ ' +
      custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</strong></div>';

    document.getElementById('calcPanel').innerHTML = html;

    var vals = [];
    if (ha === 0) vals.push({ tipo: 'warn', t: 'Selecione ao menos um talhão' });
    productLines.forEach(function (p) {
      if (!p.ok) {
        vals.push({
          tipo: 'risk',
          t: p.nome + ': necessidade ' + p.qtd.toFixed(1) + ' ' + p.unidade +
            ' · disponível ' + p.estoque + ' ' + p.unidade
        });
      } else {
        vals.push({
          tipo: 'ok',
          t: p.nome + ': estoque suficiente (' + p.estoque + ' ' + p.unidade + ')'
        });
      }
    });
    if (productLines.length === 0) vals.push({ tipo: 'warn', t: 'Adicione produtos à calda' });

    document.getElementById('validacoes').innerHTML = vals.map(function (v) {
      var cls = v.tipo === 'risk' ? 'is-risk' : (v.tipo === 'warn' ? 'is-warn' : '');
      var badge = v.tipo === 'risk' ? 'badge-risk' : (v.tipo === 'warn' ? 'badge-warn' : 'badge-ok');
      return '<li class="alert-item ' + cls + '"><span class="badge ' + badge + '">' +
        (v.tipo === 'ok' ? 'OK' : v.tipo === 'risk' ? 'Risco' : 'Atenção') +
        '</span><div><strong>' + v.t + '</strong></div></li>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    FS.initShell('ops');
    renderTalhoes();
    renderProducts();
    recalc();

    ['caldaLha', 'tanqueL', 'segurancaPct'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', recalc);
    });

    document.getElementById('addProduct').addEventListener('click', function () {
      lines.push({
        catalogId: FS_DATA.catalogoPrescricao[0].id,
        dose: FS_DATA.catalogoPrescricao[0].dosePadrao,
        ordem: lines.length + 1
      });
      renderProducts();
      recalc();
    });

    var statusEl = document.getElementById('prescStatus');
    document.querySelectorAll('[data-presc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = btn.getAttribute('data-presc');
        var map = {
          rascunho: ['Rascunho salvo', 'Rascunho'],
          aprovacao: ['Aprovação solicitada ao RT', 'Aguardando aprovação'],
          emitir: ['Prescrição emitida PS-0149', 'Emitida'],
          reservar: ['Estoque reservado nos lotes selecionados', 'Estoque reservado'],
          pdf: ['Abrindo impressão / PDF…', null],
          share: ['Link de compartilhamento copiado (simulação)', null],
          aplicar: ['Prescrição convertida em aplicação executada', 'Aplicação']
        };
        var info = map[a];
        if (a === 'pdf') {
          FS.toast(info[0]);
          setTimeout(function () { window.print(); }, 300);
          return;
        }
        FS.toast(info[0]);
        if (info[1]) {
          statusEl.textContent = info[1];
          statusEl.className = 'badge ' + (a === 'emitir' || a === 'aplicar' ? 'badge-ok' : 'badge-neutral');
        }
      });
    });
  });
})();
