/**
 * GitQuest Engine - Condition Tree Architecture
 * Boolean logic combinators: AND, OR, NOT, SEQUENCE, and atomic condition evaluators.
 */

export class Condition {
  constructor(options = {}) {
    this.id = options.id || 'cond';
    this.description = options.description || '';
    this.isMet = false;
  }

  evaluate(engineState, context = {}) {
    return false;
  }

  reset() {
    this.isMet = false;
  }
}

export class AndCondition extends Condition {
  constructor(conditions = [], options = {}) {
    super(options);
    this.conditions = conditions;
  }

  evaluate(engineState, context = {}) {
    if (this.conditions.length === 0) return true;
    for (const cond of this.conditions) {
      if (!cond.evaluate(engineState, context)) {
        this.isMet = false;
        return false;
      }
    }
    this.isMet = true;
    return true;
  }

  reset() {
    super.reset();
    for (const c of this.conditions) c.reset();
  }
}

export class OrCondition extends Condition {
  constructor(conditions = [], options = {}) {
    super(options);
    this.conditions = conditions;
  }

  evaluate(engineState, context = {}) {
    if (this.conditions.length === 0) return true;
    for (const cond of this.conditions) {
      if (cond.evaluate(engineState, context)) {
        this.isMet = true;
        return true;
      }
    }
    this.isMet = false;
    return false;
  }

  reset() {
    super.reset();
    for (const c of this.conditions) c.reset();
  }
}

export class NotCondition extends Condition {
  constructor(condition, options = {}) {
    super(options);
    this.condition = condition;
  }

  evaluate(engineState, context = {}) {
    this.isMet = !this.condition.evaluate(engineState, context);
    return this.isMet;
  }

  reset() {
    super.reset();
    this.condition.reset();
  }
}

export class SequenceCondition extends Condition {
  constructor(conditions = [], options = {}) {
    super(options);
    this.conditions = conditions;
    this.currentIndex = 0;
  }

  evaluate(engineState, context = {}) {
    if (this.currentIndex >= this.conditions.length) {
      this.isMet = true;
      return true;
    }

    const currentCond = this.conditions[this.currentIndex];
    if (currentCond.evaluate(engineState, context)) {
      this.currentIndex++;
      if (this.currentIndex >= this.conditions.length) {
        this.isMet = true;
        return true;
      }
    }

    return false;
  }

  reset() {
    super.reset();
    this.currentIndex = 0;
    for (const c of this.conditions) c.reset();
  }
}
