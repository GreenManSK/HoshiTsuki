import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private static readonly EDITS_KEY = 'edits';

  constructor() {
  }

  public get<T>( key: string, defaultValue: T ): T {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return defaultValue;
    }
    return JSON.parse(rawValue) as T;
  }

  public set( key: string, value: any ) {
    localStorage.setItem(key, JSON.stringify(value));
    this.setEditTime(key);
  }

  public getEditTime( key: string ): Date | undefined {
    const edits = this.getEdits();
    if (edits[key]) {
      return new Date(edits[key]);
    }
    return undefined;
  }

  private setEditTime( key: string ) {
    const edits = this.getEdits();
    edits[key] = Date.now();
    localStorage.setItem(LocalStorageService.EDITS_KEY, JSON.stringify(edits));
  }

  private getEdits() {
    return this.get<{ [key: string]: number }>(LocalStorageService.EDITS_KEY, {});
  }
}

