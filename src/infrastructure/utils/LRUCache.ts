/**
 * LRU (Least Recently Used) Cache Entry
 * Efficient cache implementation with O(1) operations
 */

interface LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null;
  next: LRUNode<K, V> | null;
}

/**
 * LRU Cache implementation
 * Provides O(1) get/set operations with automatic eviction
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V> | null;
  private tail: LRUNode<K, V> | null;
  private _size: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * Get value by key and move to front (most recently used)
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) {
      return undefined;
    }

    // Move to front (most recently used)
    this.moveToFront(node);
    return node.value;
  }

  /**
   * Set value and evict least recently used if at capacity
   */
  set(key: K, value: V): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      // Update existing node
      existingNode.value = value;
      this.moveToFront(existingNode);
      return;
    }

    // Create new node
    const newNode: LRUNode<K, V> = {
      key,
      value,
      prev: null,
      next: null,
    };

    // Add to cache
    this.cache.set(key, newNode);
    this.addToFront(newNode);
    this._size++;

    // Evict if at capacity
    if (this._size > this.capacity) {
      this.removeLeastRecentlyUsed();
    }
  }

  /**
   * Check if key exists
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete specific key
   */
  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) {
      return false;
    }

    this.removeNode(node);
    this.cache.delete(key);
    this._size--;
    return true;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * Get current size
   */
  size(): number {
    return this._size;
  }

  /**
   * Get all keys in order (most recent to least recent)
   */
  keys(): K[] {
    const keys: K[] = [];
    let current = this.head;
    while (current) {
      keys.push(current.key);
      current = current.next;
    }
    return keys;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; capacity: number; usage: number } {
    return {
      size: this._size,
      capacity: this.capacity,
      usage: this._size / this.capacity,
    };
  }

  /**
   * Add node to front of list (most recently used)
   */
  private addToFront(node: LRUNode<K, V>): void {
    node.prev = null;
    node.next = this.head;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  /**
   * Move existing node to front
   */
  private moveToFront(node: LRUNode<K, V>): void {
    if (node === this.head) {
      return;
    }

    // Remove node from current position
    this.removeNode(node);

    // Add to front
    node.prev = null;
    node.next = this.head;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    // If node was tail, update tail
    if (this.tail === null) {
      this.tail = node;
    } else if (this.tail.prev === node) {
      this.tail = node;
    }
  }

  /**
   * Remove node from list (without deleting from cache)
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  /**
   * Remove least recently used (tail) node
   */
  private removeLeastRecentlyUsed(): void {
    if (!this.tail) {
      return;
    }

    const lruKey = this.tail.key;
    this.removeNode(this.tail);
    this.cache.delete(lruKey);
    this._size--;
  }
}
