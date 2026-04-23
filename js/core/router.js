export class Router {
  constructor(pages) {
    this.pages = pages;
    this.current = null;
  }

  navigate(page, payload = null) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    if (this.pages[page]) {
      this.pages[page].render(payload);
      this.current = page;
      window.EventBus.emit('route:changed', { page, payload });
    }
  }
}