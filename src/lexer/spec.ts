export const comments = {
  singleLine: "//" as const,
  multiLine: ["/*", "*/"] as const,
};

/**
 * Preserved words in the language.
 * Preserved words are words that cannot be used as identifiers.
 */
export const preserved = ["fn", "return", "if", "else", "do", "while"] as const;

export const operators = {
  assignment: ["="] as const,
  arithmetic: ["+", "-", "*", "/", "%"] as const,
  logical: ["&&", "||"] as const,
  comparison: ["==", "!=", "<", "<=", ">", ">="] as const,
  bitwise: ["&", "|", "^", "~", "<<", ">>"] as const,
  other: [":", ",", "(", ")", "{", "}", ";"] as const,
};

export const identifier = /[a-zA-Z_]\w*/;
