/**
 * GitQuest Engine - Command Token & Lexer
 * Tokenizes raw terminal input into structured lexical tokens supporting flags, options, and strings.
 */

export const TokenType = Object.freeze({
  KEYWORD: 'KEYWORD',
  SUBCOMMAND: 'SUBCOMMAND',
  FLAG: 'FLAG',           // e.g. -m, -b, --hard, --soft
  ARGUMENT: 'ARGUMENT',   // e.g. '08', 'main', 'feat/login'
  STRING: 'STRING',       // e.g. "Initial commit"
  PIPE: 'PIPE',           // |
  EOF: 'EOF'
});

export class CommandToken {
  constructor(type, value, startPos = 0, endPos = 0) {
    this.type = type;
    this.value = value;
    this.startPos = startPos;
    this.endPos = endPos;
  }
}

export class CommandLexer {
  static tokenize(input) {
    const tokens = [];
    if (!input || typeof input !== 'string') return tokens;

    const trimmed = input.trim();
    let i = 0;
    const len = trimmed.length;

    while (i < len) {
      const char = trimmed[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Quoted string (single or double quote)
      if (char === '"' || char === "'") {
        const quoteChar = char;
        const start = i;
        i++; // skip opening quote
        let strVal = '';
        while (i < len && trimmed[i] !== quoteChar) {
          if (trimmed[i] === '\\' && i + 1 < len) {
            i++;
            strVal += trimmed[i];
          } else {
            strVal += trimmed[i];
          }
          i++;
        }
        if (i < len) i++; // skip closing quote
        tokens.push(new CommandToken(TokenType.STRING, strVal, start, i));
        continue;
      }

      // Pipe symbol
      if (char === '|') {
        tokens.push(new CommandToken(TokenType.PIPE, '|', i, i + 1));
        i++;
        continue;
      }

      // Flag (e.g. -m, --hard)
      if (char === '-') {
        const start = i;
        let flagVal = '';
        while (i < len && !/\s/.test(trimmed[i])) {
          flagVal += trimmed[i];
          i++;
        }
        tokens.push(new CommandToken(TokenType.FLAG, flagVal, start, i));
        continue;
      }

      // General word/identifier/number
      const start = i;
      let wordVal = '';
      while (i < len && !/\s/.test(trimmed[i]) && trimmed[i] !== '|' && trimmed[i] !== '"' && trimmed[i] !== "'") {
        wordVal += trimmed[i];
        i++;
      }

      if (tokens.length === 0) {
        tokens.push(new CommandToken(TokenType.KEYWORD, wordVal, start, i));
      } else if (tokens.length === 1 && tokens[0].type === TokenType.KEYWORD) {
        tokens.push(new CommandToken(TokenType.SUBCOMMAND, wordVal, start, i));
      } else {
        tokens.push(new CommandToken(TokenType.ARGUMENT, wordVal, start, i));
      }
    }

    tokens.push(new CommandToken(TokenType.EOF, '', len, len));
    return tokens;
  }
}
