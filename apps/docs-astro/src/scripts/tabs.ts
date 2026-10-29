/**
 * `<ftds-tabs>`: tabs without a framework. Markup is rendered by Astro:
 *
 *   <ftds-tabs data-sync="pm">
 *     <div role="tablist"><button role="tab" data-value="pnpm">…</button>…</div>
 *     <div role="tabpanel" data-value="pnpm">…</div>
 *   </ftds-tabs>
 *
 * Tabs that share a `data-sync` key switch together and remember the choice.
 * With `data-hash`, the URL hash picks the tab (`#usage`), and a hash that
 * points inside a panel (a heading, a search result) opens that panel.
 * Every change fires a bubbling `ftds-tabs:change` event.
 */
const SYNC = "ftds-tabs:sync";
export const CHANGE = "ftds-tabs:change";

class FtdsTabs extends HTMLElement {
  #tabs: HTMLButtonElement[] = [];
  #panels: HTMLElement[] = [];

  connectedCallback() {
    // Own tabs only: the tablist may sit in a toolbar, and tabs can nest
    const own = <T extends Element>(el: T) => el.closest("ftds-tabs") === this;
    this.#tabs = [
      ...this.querySelectorAll<HTMLButtonElement>("[role=tab]"),
    ].filter(own);
    this.#panels = [
      ...this.querySelectorAll<HTMLElement>("[role=tabpanel]"),
    ].filter(own);

    this.#tabs.forEach((tab, i) => {
      tab.addEventListener("click", () =>
        this.select(tab.dataset.value!, true),
      );
      tab.addEventListener("keydown", (event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        const next =
          this.#tabs[(i + step + this.#tabs.length) % this.#tabs.length];
        next.focus();
        this.select(next.dataset.value!, true);
      });
    });

    const key = this.dataset.sync;
    if (key) {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(`tabs:${key}`);
      } catch {}
      if (saved) this.select(saved, false);
      document.addEventListener(SYNC, (event) => {
        const detail = (event as CustomEvent<{ key: string; value: string }>)
          .detail;
        if (detail.key === key) this.select(detail.value, false);
      });
    }

    if (this.hasAttribute("data-hash")) {
      this.#followHash();
      window.addEventListener("hashchange", () => this.#followHash());
    }
  }

  #followHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    if (this.#tabs.some((tab) => tab.dataset.value === id)) {
      this.select(id, false);
      return;
    }
    const target = document.getElementById(id);
    const panel = target?.closest<HTMLElement>("[role=tabpanel]");
    if (!target || !panel || !this.#panels.includes(panel)) return;
    this.select(panel.dataset.value!, false);
    target.scrollIntoView();
  }

  select(value: string, fromUser: boolean) {
    if (!this.#tabs.some((tab) => tab.dataset.value === value)) return;
    for (const tab of this.#tabs) {
      const selected = tab.dataset.value === value;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of this.#panels)
      panel.hidden = panel.dataset.value !== value;
    this.dataset.selected = value;
    this.dispatchEvent(
      new CustomEvent(CHANGE, { bubbles: true, detail: { value } }),
    );

    if (!fromUser) return;
    if (this.hasAttribute("data-hash")) {
      history.replaceState(null, "", `#${value}`);
    }
    const key = this.dataset.sync;
    if (key) {
      try {
        localStorage.setItem(`tabs:${key}`, value);
      } catch {}
      document.dispatchEvent(new CustomEvent(SYNC, { detail: { key, value } }));
    }
  }
}

if (!customElements.get("ftds-tabs"))
  customElements.define("ftds-tabs", FtdsTabs);
