/* FortSmart — mock data for prototypes */
window.FS_DATA = {
  fazenda: {
    nome: 'Fazenda Ferradura',
    municipio: 'Sorriso — MT',
    safra: '2025/26',
    cultura: 'Soja',
    areaTotalHa: 1840
  },

  metrics: {
    areaPlantadaHa: 1620,
    aplicacoes: 47,
    custoHa: 312.4,
    progressoPct: 68,
    gastoTotal: 506088,
    estoqueOk: false
  },

  talhoes: [
    { id: 't01', nome: 'Talhão 01', areaHa: 85, status: 'ok', x: 40, y: 60, w: 90, h: 70 },
    { id: 't07', nome: 'Talhão 07', areaHa: 120, status: 'warn', x: 140, y: 40, w: 110, h: 90 },
    { id: 't12', nome: 'Talhão 12', areaHa: 95, status: 'ok', x: 260, y: 55, w: 100, h: 80 },
    { id: 't14', nome: 'Talhão 14', areaHa: 110, status: 'risk', x: 100, y: 150, w: 120, h: 85 },
    { id: 't18', nome: 'Talhão 18', areaHa: 78, status: 'ok', x: 240, y: 160, w: 95, h: 75 },
    { id: 't22', nome: 'Talhão 22', areaHa: 140, status: 'idle', x: 360, y: 90, w: 115, h: 100 }
  ],

  alertas: [
    { id: 1, tipo: 'risk', titulo: 'Estoque crítico — Glifosato 480', texto: 'Saldo 42 L · necessidade programada 180 L (próx. 5 dias)' },
    { id: 2, tipo: 'warn', titulo: 'Validade próxima — Inoculante Bradyrhizobium', texto: 'Lote L-8821 vence em 12 dias · Galpão Central' },
    { id: 3, tipo: 'warn', titulo: 'Aplicação atrasada — Talhão 14', texto: 'Prescrição PS-0146 prevista para 02/09 · ainda não executada' },
    { id: 4, tipo: 'risk', titulo: 'Pendência técnica — CREA', texto: 'Relatório de monitoramento T14 aguarda assinatura do RT' }
  ],

  agenda: [
    { data: '05/09', titulo: 'Aplicação fungicida', meta: 'Talhões 07 e 12 · 215 ha' },
    { data: '06/09', titulo: 'Recebimento de insumos', meta: 'NF 45821 · Galpão Norte' },
    { data: '07/09', titulo: 'Monitoramento fenológico', meta: 'Talhão 14 · R2' },
    { data: '08/09', titulo: 'Inventário parcial', meta: 'Químicos · Galpão Central' }
  ],

  registros: [
    { hora: '08:42', titulo: 'Aplicação registrada', meta: 'Talhão 01 · 85 ha · Herbicida' },
    { hora: '07:15', titulo: 'Prescrição emitida', meta: 'PS-0148 · Carlos H. · CREA' },
    { hora: 'Ontem', titulo: 'Transferência de estoque', meta: 'Ureia 50 sc · Central → Norte' },
    { hora: 'Ontem', titulo: 'Monitoramento sync', meta: '12 pontos · offline → nuvem' }
  ],

  previstoRealizado: [
    { label: 'Herbic.', planejado: 100, realizado: 92 },
    { label: 'Fungic.', planejado: 80, realizado: 45 },
    { label: 'Insetic.', planejado: 60, realizado: 58 },
    { label: 'Foliar', planejado: 40, realizado: 22 },
    { label: 'Biológ.', planejado: 50, realizado: 48 }
  ],

  produtos: [
    {
      id: 'p1',
      nome: 'Glifosato 480',
      categoria: 'quimicos',
      unidade: 'L',
      saldo: 42,
      minimo: 100,
      custoMedio: 28.5,
      critico: true,
      fazenda: 'Ferradura',
      galpao: 'Central',
      lotes: [
        { codigo: 'GL-4412', saldo: 42, validade: '2026-03-15', custo: 28.5 }
      ],
      movimentacoes: [
        { data: '28/08', tipo: 'Saída', qtd: '-120 L', dest: 'Aplicação T01' },
        { data: '12/08', tipo: 'Entrada', qtd: '+200 L', dest: 'NF 44190' }
      ],
      aplicacoes: [
        { data: '28/08', talhao: 'Talhão 01', safra: '2025/26', ha: 85, custo: 2422.5 }
      ]
    },
    {
      id: 'p2',
      nome: 'Inoculante Bradyrhizobium',
      categoria: 'biologicos',
      unidade: 'doses',
      saldo: 320,
      minimo: 200,
      custoMedio: 1.8,
      critico: false,
      fazenda: 'Ferradura',
      galpao: 'Central',
      lotes: [
        { codigo: 'L-8821', saldo: 180, validade: '2026-09-16', custo: 1.75 },
        { codigo: 'L-9010', saldo: 140, validade: '2027-01-20', custo: 1.85 }
      ],
      movimentacoes: [
        { data: '20/08', tipo: 'Entrada', qtd: '+140 doses', dest: 'NF 45201' }
      ],
      aplicacoes: [
        { data: '15/08', talhao: 'Talhão 07', safra: '2025/26', ha: 120, custo: 216 }
      ]
    },
    {
      id: 'p3',
      nome: 'Semente Soja 97R21',
      categoria: 'sementes',
      unidade: 'sc',
      saldo: 860,
      minimo: 400,
      custoMedio: 185,
      critico: false,
      fazenda: 'Ferradura',
      galpao: 'Norte',
      lotes: [
        { codigo: 'SM-2104', saldo: 500, validade: '2027-06-01', custo: 182 },
        { codigo: 'SM-2111', saldo: 360, validade: '2027-06-01', custo: 189 }
      ],
      movimentacoes: [
        { data: '01/09', tipo: 'Saída', qtd: '-40 sc', dest: 'Plantio T22' }
      ],
      aplicacoes: []
    },
    {
      id: 'p4',
      nome: 'Ureia 45%',
      categoria: 'fertilizantes',
      unidade: 'sc',
      saldo: 210,
      minimo: 150,
      custoMedio: 98,
      critico: false,
      fazenda: 'Ferradura',
      galpao: 'Norte',
      lotes: [
        { codigo: 'UR-778', saldo: 210, validade: '2027-01-01', custo: 98 }
      ],
      movimentacoes: [
        { data: '03/09', tipo: 'Transferência', qtd: '50 sc', dest: 'Central → Norte' }
      ],
      aplicacoes: []
    },
    {
      id: 'p5',
      nome: 'Gesso agrícola',
      categoria: 'corretivos',
      unidade: 't',
      saldo: 48,
      minimo: 20,
      custoMedio: 220,
      critico: false,
      fazenda: 'Ferradura',
      galpao: 'Central',
      lotes: [
        { codigo: 'GE-102', saldo: 48, validade: '2028-01-01', custo: 220 }
      ],
      movimentacoes: [],
      aplicacoes: []
    },
    {
      id: 'p6',
      nome: 'Azoxistrobina + Ciproconazol',
      categoria: 'quimicos',
      unidade: 'L',
      saldo: 156,
      minimo: 80,
      custoMedio: 145,
      critico: false,
      fazenda: 'Ferradura',
      galpao: 'Central',
      lotes: [
        { codigo: 'AZ-3301', saldo: 96, validade: '2026-11-01', custo: 142 },
        { codigo: 'AZ-3310', saldo: 60, validade: '2027-02-01', custo: 149 }
      ],
      movimentacoes: [
        { data: '25/08', tipo: 'Entrada', qtd: '+60 L', dest: 'NF 45667' }
      ],
      aplicacoes: [
        { data: '10/08', talhao: 'Talhão 12', safra: '2025/26', ha: 95, custo: 4132.5 }
      ]
    }
  ],

  catalogoPrescricao: [
    { id: 'p1', nome: 'Glifosato 480', unidade: 'L', dosePadrao: 2.5, custo: 28.5, estoque: 42 },
    { id: 'p6', nome: 'Azoxistrobina + Ciproconazol', unidade: 'L', dosePadrao: 0.3, custo: 145, estoque: 156 },
    { id: 'p2', nome: 'Inoculante Bradyrhizobium', unidade: 'doses', dosePadrao: 1, custo: 1.8, estoque: 320 },
    { id: 'adj1', nome: 'Óleo mineral', unidade: 'L', dosePadrao: 0.5, custo: 12, estoque: 200 }
  ]
};
