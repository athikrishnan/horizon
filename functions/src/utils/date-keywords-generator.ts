export class DateKeywordsGenerator {
  generate(date: Date): string[] {
    const keywords: string[] = [];

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const full = day + month + year;

    keywords.push('D' + day);
    keywords.push('M' + month);
    keywords.push('Y' + year);
    keywords.push('DM' + day + month);
    keywords.push('MY' + month + year);
    keywords.push('DMY' + full);
    return keywords;
  }
}