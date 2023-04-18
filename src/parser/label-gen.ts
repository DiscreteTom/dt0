/**
 * We need this to generate unique labels for blocks.
 */
export class LabelGenerator {
  private n = 0;

  /**
   * Return the next unique label.
   */
  next(): string {
    this.n++;
    return `label_${this.n}`;
  }
}
