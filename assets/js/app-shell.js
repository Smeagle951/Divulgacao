/* FortSmart App Shell helpers */
(function () {
  function icon(name, cls) {
    const paths = {
      layout: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
      ops: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
      box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
      search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
      chevron: '<polyline points="15 18 9 12 15 6"/>',
      x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'
    };
    return `<svg class="fs-icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  }

  window.FS = {
    icon,

    toast(msg) {
      let host = document.querySelector('.toast-host');
      if (!host) {
        host = document.createElement('div');
        host.className = 'toast-host';
        document.body.appendChild(host);
      }
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      host.appendChild(el);
      setTimeout(() => el.remove(), 2800);
    },

    openDrawer(id) {
      document.getElementById(id)?.classList.add('is-open');
      document.getElementById(id + '-backdrop')?.classList.add('is-open');
    },

    closeDrawer(id) {
      document.getElementById(id)?.classList.remove('is-open');
      document.getElementById(id + '-backdrop')?.classList.remove('is-open');
    },

    openModal(id) {
      document.getElementById(id)?.classList.add('is-open');
    },

    closeModal(id) {
      document.getElementById(id)?.classList.remove('is-open');
    },

    initShell(active) {
      const sidebar = document.getElementById('appSidebar');
      const collapseBtn = document.getElementById('collapseSidebar');
      if (collapseBtn && sidebar) {
        const stored = sessionStorage.getItem('fs-sidebar-collapsed') === '1';
        if (stored) {
          sidebar.classList.add('is-collapsed');
          document.body.classList.add('sidebar-collapsed');
        }
        collapseBtn.addEventListener('click', () => {
          sidebar.classList.toggle('is-collapsed');
          document.body.classList.toggle('sidebar-collapsed');
          sessionStorage.setItem(
            'fs-sidebar-collapsed',
            sidebar.classList.contains('is-collapsed') ? '1' : '0'
          );
        });
      }

      document.querySelectorAll('[data-active]').forEach((el) => {
        if (el.getAttribute('data-active') === active) el.classList.add('is-active');
      });

      document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
        btn.addEventListener('click', () => this.closeDrawer(btn.getAttribute('data-close-drawer')));
      });

      document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', () => this.closeModal(btn.getAttribute('data-close-modal')));
      });

      document.querySelectorAll('.drawer-backdrop, .modal-backdrop').forEach((el) => {
        el.addEventListener('click', (e) => {
          if (e.target === el) el.classList.remove('is-open');
          const drawerId = el.id?.replace('-backdrop', '');
          if (drawerId) document.getElementById(drawerId)?.classList.remove('is-open');
        });
      });

      const fab = document.getElementById('fabNovo');
      if (fab) {
        fab.addEventListener('click', () => this.toast('Novo registro — escolha o tipo na próxima versão'));
      }

      const fazenda = window.FS_DATA?.fazenda;
      if (fazenda) {
        document.querySelectorAll('[data-fazenda]').forEach((el) => { el.textContent = fazenda.nome; });
        document.querySelectorAll('[data-safra]').forEach((el) => { el.textContent = `Safra ${fazenda.safra} · ${fazenda.cultura}`; });
      }
    }
  };
})();
