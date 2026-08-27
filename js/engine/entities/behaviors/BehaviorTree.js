/**
 * GitQuest Engine - Behavior Tree AI Framework
 * Full hierarchical behavior tree AI for CI patrol drones, autonomous developer bots, and interactive puzzle companions.
 */

export const NodeStatus = Object.freeze({
  SUCCESS: 'success',
  FAILURE: 'failure',
  RUNNING: 'running'
});

export class BehaviorNode {
  constructor(name = 'Node') {
    this.name = name;
  }

  tick(context) {
    return NodeStatus.SUCCESS;
  }
}

export class SequenceNode extends BehaviorNode {
  constructor(name = 'Sequence', children = []) {
    super(name);
    this.children = children;
  }

  addChild(node) {
    this.children.push(node);
  }

  tick(context) {
    for (const child of this.children) {
      const status = child.tick(context);
      if (status !== NodeStatus.SUCCESS) {
        return status;
      }
    }
    return NodeStatus.SUCCESS;
  }
}

export class SelectorNode extends BehaviorNode {
  constructor(name = 'Selector', children = []) {
    super(name);
    this.children = children;
  }

  addChild(node) {
    this.children.push(node);
  }

  tick(context) {
    for (const child of this.children) {
      const status = child.tick(context);
      if (status !== NodeStatus.FAILURE) {
        return status;
      }
    }
    return NodeStatus.FAILURE;
  }
}

export class ConditionNode extends BehaviorNode {
  constructor(name = 'Condition', predicate) {
    super(name);
    this.predicate = predicate;
  }

  tick(context) {
    return this.predicate(context) ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}

export class ActionNode extends BehaviorNode {
  constructor(name = 'Action', actionFn) {
    super(name);
    this.actionFn = actionFn;
  }

  tick(context) {
    return this.actionFn(context);
  }
}

export class InverterNode extends BehaviorNode {
  constructor(child) {
    super('Inverter');
    this.child = child;
  }

  tick(context) {
    const status = this.child.tick(context);
    if (status === NodeStatus.SUCCESS) return NodeStatus.FAILURE;
    if (status === NodeStatus.FAILURE) return NodeStatus.SUCCESS;
    return status;
  }
}

export class StateMachineComponent {
  constructor(initialState = 'idle') {
    this.currentState = initialState;
    this.states = new Map(); // stateName -> { onEnter, onUpdate, onExit }
    this.transitions = []; // Array<{ from, to, condition }>
  }

  addState(stateName, callbacks = {}) {
    this.states.set(stateName, callbacks);
  }

  addTransition(from, to, condition) {
    this.transitions.push({ from, to, condition });
  }

  changeState(newState, context = {}) {
    if (this.currentState === newState) return;

    const oldCallbacks = this.states.get(this.currentState);
    if (oldCallbacks?.onExit) oldCallbacks.onExit(context);

    this.currentState = newState;

    const newCallbacks = this.states.get(this.currentState);
    if (newCallbacks?.onEnter) newCallbacks.onEnter(context);
  }

  update(context = {}) {
    for (const t of this.transitions) {
      if ((t.from === '*' || t.from === this.currentState) && t.condition(context)) {
        this.changeState(t.to, context);
        break;
      }
    }

    const callbacks = this.states.get(this.currentState);
    if (callbacks?.onUpdate) {
      callbacks.onUpdate(context);
    }
  }
}
