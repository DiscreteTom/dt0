export class LabelGenerator {
  private n = 0;

  next(): string {
    this.n++;
    return `label_${this.n}`;
  }
}
