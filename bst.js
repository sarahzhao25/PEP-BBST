function BinarySearchTree(value) {
  this.value = value;
  this._size = 1;
  this._leftHeight = this._rightHeight = 0;
  this.left = this.right = null;
  this.parent = null; //needs a 'parent' node in order to access back up the BST. only the root node has no parents.
}
//adding in a function 'balancefactor' to the tree to initiate height balance.
BinarySearchTree.prototype.balanceFactor = function() {
  return this._rightHeight - this._leftHeight;
}

BinarySearchTree.prototype.insert = function(newValue) {
  let side = newValue <= this.value ? 'left' : 'right';
  if (this[side]) this[side].insert(newValue);
  else {
    this[side] = new BinarySearchTree(newValue);
    this[side].parent = {node: this, side: side}
  }
  this._size++;
};

BinarySearchTree.prototype.delete = function(value) {
  let treeNode = this.find(value);

}

BinarySearchTree.prototype.find = function(value) {
  if (this.contains(value)) {
    if (value < this.value) return this.left.find(value);
    else if (value > this.value) return this.right.find(value);
    else return this;
  }
}

BinarySearchTree.prototype.contains = function(value) {
  if (value < this.value) return !!this.left && this.left.contains(value);
  else if (value > this.value) return !!this.right && this.right.contains(value);
  else return true;
};

BinarySearchTree.prototype.depthFirstForEach = function(iterator, order = 'in-order') {
  if (order === 'in-order') {
    if (this.left) this.left.depthFirstForEach(iterator, order);
    iterator(this.value);
    if (this.right) this.right.depthFirstForEach(iterator, order);
  }
  else if (order === 'pre-order') {
    iterator(this.value);
    if (this.left) this.left.depthFirstForEach(iterator, order);
    if (this.right) this.right.depthFirstForEach(iterator, order);
  }
  else if (order === 'post-order') {
    if (this.left) this.left.depthFirstForEach(iterator, order);
    if (this.right) this.right.depthFirstForEach(iterator, order);
    iterator(this.value);
  }
};

BinarySearchTree.prototype.breadthFirstForEach = function(iterator) {
  let queue = [this];
  while (queue.length) {
    let tree = queue.shift();
    iterator(tree.value);
    if (tree.left) queue.push(tree.left);
    if (tree.right) queue.push(tree.right);
  }
};

BinarySearchTree.prototype.size = function() {return this._size};
