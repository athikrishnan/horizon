import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor() { }

  generateKeywords(word: string): string[] {
    const words: string[] = [];
    let current = '';
    word.toLowerCase().split('').forEach((char: string) => {
      current += char;
      words.push(current);
    });
    return words;
  }
}
