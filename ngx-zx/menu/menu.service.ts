import { computed, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MenuService {
  private selectedKeySignal = signal<string>("");
  private openKeysSignal = signal<string[]>([]);

  selectedKey = this.selectedKeySignal.asReadonly();
  openKeys = this.openKeysSignal.asReadonly();

  // Computed values
  hasSelectedKey = computed(() => this.selectedKeySignal() !== "");
  openKeyCount = computed(() => this.openKeysSignal().length);

  setSelectedKey(key: string) {
    this.selectedKeySignal.set(key);
  }

  setOpenKeys(keys: string[]) {
    this.openKeysSignal.set(keys);
  }

  addOpenKey(key: string) {
    const current = this.openKeysSignal();
    if (!current.includes(key)) {
      this.openKeysSignal.set([...current, key]);
    }
  }

  removeOpenKey(key: string) {
    const current = this.openKeysSignal();
    this.openKeysSignal.set(current.filter(k => k !== key));
  }

  toggleOpenKey(key: string) {
    const current = this.openKeysSignal();
    if (current.includes(key)) {
      this.removeOpenKey(key);
    } else {
      this.addOpenKey(key);
    }
  }

  clearOpenKeys() {
    this.openKeysSignal.set([]);
  }
}
