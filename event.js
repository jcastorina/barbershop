class Node {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.parent = null;
  }

  add(child) {
    child.parent = this;
    this.children.push(child);
  }

  // Method to simulate event dispatching
  dispatchEvent(event) {
    // Propagate event down to the target
    this.propagateEvent(event, "capturing");
    // Trigger event at target
    event.trigger();
    // Propagate event up from the target
    event.target.propagateEvent(event, "bubbling");
  }

  propagateEvent(event, phase) {
    if (phase === "capturing") {
      event.callback(this, phase);
      for (const child of this.children) {
        child.propagateEvent(event, phase);
      }
    } else if (phase === "bubbling") {
      event.callback(this, phase);
      if (this.parent) {
        this.parent.propagateEvent(event, phase);
      }
    }
  }
}

// Example tree (simplified DOM)
const root = new Node("root");
const child1 = new Node("child1");
const child2 = new Node("child2");
const grandchild1 = new Node("grandchild1");

root.add(child1);
root.add(child2);
child1.add(grandchild1);

class Event {
  constructor(target, callback) {
    this.target = target;
    this.callback = callback;
  }

  trigger() {
    this.callback(this.target, "at_target");
  }
}

// Example event callback function
function eventCallback(node, phase) {
  console.log(`Event at ${node.name} during ${phase} phase.`);
}

const myEvent = new Event(grandchild1, eventCallback);
root.dispatchEvent(myEvent);
