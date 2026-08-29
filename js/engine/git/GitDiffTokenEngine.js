/**
 * GitQuest Game Engine - Git Diff Token Engine
 * Character and word-level intra-line diff tokenizer, whitespace normalization,
 * and Myers character-level edit sequence generator.
 */

export class DiffToken {
  constructor(type, text) {
    this.type = type; // 'EQUAL', 'ADDED', 'REMOVED'
    this.text = text;
  }
}

export class GitDiffTokenEngine {
  tokenizeWords(line) {
    return (line || '').match(/\w+|\s+|[^\w\s]+/g) || [];
  }

  computeIntraLineDiff(oldLine, newLine) {
    const oldWords = this.tokenizeWords(oldLine);
    const newWords = this.tokenizeWords(newLine);

    const oldTokens = [];
    const newTokens = [];

    let oIdx = 0;
    let nIdx = 0;

    while (oIdx < oldWords.length || nIdx < newWords.length) {
      const oWord = oldWords[oIdx];
      const nWord = newWords[nIdx];

      if (oWord === nWord) {
        oldTokens.push(new DiffToken('EQUAL', oWord));
        newTokens.push(new DiffToken('EQUAL', nWord));
        oIdx++;
        nIdx++;
      } else if (oIdx < oldWords.length && !newWords.slice(nIdx).includes(oWord)) {
        oldTokens.push(new DiffToken('REMOVED', oWord));
        oIdx++;
      } else if (nIdx < newWords.length && !oldWords.slice(oIdx).includes(nWord)) {
        newTokens.push(new DiffToken('ADDED', nWord));
        nIdx++;
      } else {
        if (oIdx < oldWords.length) {
          oldTokens.push(new DiffToken('REMOVED', oWord));
          oIdx++;
        }
        if (nIdx < newWords.length) {
          newTokens.push(new DiffToken('ADDED', nWord));
          nIdx++;
        }
      }
    }

    return { oldTokens, newTokens };
  }
}
