function BinarySearchTree(value) {
  this.value = value;
  this._size = 1;
  this.left = this.right = null;
  this.parent = {node: null, side: ''}; //needs a 'parent' node in order to access back up the BST. only the root node has no parents.
}

//adding in a function 'balancefactor' to the tree to initiate height balance & the need for a rotation.
BinarySearchTree.prototype.balanceFactor = function() {
  return this.height(this.left) - this.height(this.right);
}
//the height is the longest path in the tree.
BinarySearchTree.prototype.height = function(treeNode) {
  return (treeNode === null) ? -1 : Math.max(this.height(treeNode.left), this.height(treeNode.right)) + 1;
}

BinarySearchTree.prototype.insert = function(newValue) {
  let side = newValue <= this.value ? 'left' : 'right';
  if (this[side]) {
    this[side].insert(newValue);
  }
  else {
    this[side] = new BinarySearchTree(newValue);
    this[side].parent = {node: this, side: side};
    //recursive call to rotate roots.
    checkAndRotateRoots(this[side]);
  }
  this._size++;
};

BinarySearchTree.prototype.delete = function(value) {
  let nodeToDelete = this.find(value);
  //ROOT NODE is the one that is being deleted.
  if (nodeToDelete === this) return this.deleteRoot();

  //CASE 1 -> treeNode is a leaf node.
  if (nodeToDelete.size() === 1) {
    nodeToDelete.parent.node[nodeToDelete.parent.side] = null;
  }

  //1 child - either left or right do not exist.
  else if (!nodeToDelete.left || !nodeToDelete.right) {
    let childNode = nodeToDelete.left || nodeToDelete.right;
    nodeToDelete.parent.node[nodeToDelete.parent.side] = childNode;
    childNode.parent = nodeToDelete.parent;
  }

  //2 children.
  else {
    console.log('2 kids')
    let childNode = nodeToDelete.right.min(); //smallest larger node after the 'nodeToDelete'
    childNode._size = nodeToDelete._size - 1; //re-designating the size of the node.

    //re-designating the size of the nodes affected by swap.
    let nodeParent = childNode.parent.node;
    while (nodeParent !== nodeToDelete.parent.node) {
      nodeParent._size--;
      nodeParent = nodeParent.parent.node;
    }
    //if the smallest larger node is the 1st node in the right subtree - all of the subtree remains the same, and the nodeToDelete is replaced with the childNode.
    //if the smallest larger node is NOT the 1st node, the proper right subtree has to be replaced.
    if (childNode !== nodeToDelete.right) {
      this.replaceLeftSubtree(childNode);
      this.replaceRightSubtree(childNode, nodeToDelete);
    }
    //parent doubly-linked to child
    childNode.parent = nodeToDelete.parent;
    nodeToDelete.parent.node[nodeToDelete.parent.side] = childNode;

    //left side doubly linked to child.
    childNode.left = nodeToDelete.left;
    nodeToDelete.left.parent.node = childNode;
  }
  nodeToDelete.parent.node._size--;
}

BinarySearchTree.prototype.replaceLeftSubtree = function(childNode) {
  childNode.parent.node.left = childNode.right;
  if (childNode.right) childNode.right.parent = childNode.parent;
}

BinarySearchTree.prototype.replaceRightSubtree = function(childNode, nodeToDelete) {
  childNode.right = nodeToDelete.right;
  nodeToDelete.right.parent.node = childNode;
}

BinarySearchTree.prototype.deleteRoot = function() {
  //CASE 1 - 0 children.
  if (this._size === 1) {
    this._size = 0;
    this.value = null;
  }
  //CASE 2 - 1 child.
  else if (!this.left || !this.right) {
    let newRoot = this.left || this.right;
    this.value = newRoot.value;
    this._size = newRoot._size;
    this.left = newRoot.left;
    this.right = newRoot.right;
  }
  //CASE 3 - 2 children.
  else {
    let childNode = this.right.min();
    this.value = childNode.value;
    this._size = this._size - 1;
    if (childNode === this.right) {
      this.right = childNode.right;
      if (childNode.right) childNode.right.parent.node = this;
    }
    else {
      let nodeParent = childNode.parent.node;
      while (nodeParent !== null) {
        nodeParent._size--;
        nodeParent = nodeParent.parent.node;
      }
      this.replaceLeftSubtree(childNode);
    }
  }
}

BinarySearchTree.prototype.find = function(value) {
  if (this.contains(value)) {
    if (value < this.value) return this.left.find(value);
    else if (value > this.value) return this.right.find(value);
    else return this;
  }
  else return null;
}

BinarySearchTree.prototype.min = function() {
  if (this.left) return this.left.min();
  else return this;
}

BinarySearchTree.prototype.contains = function(value) {
  if (value < this.value) return !!this.left && this.left.contains(value);
  else if (value > this.value) return !!this.right && this.right.contains(value);
  else return true;
};

BinarySearchTree.prototype.size = function() {return this._size};

BinarySearchTree.checkAndRotateRoots = function(root) {
  if (root) {
    if (root.balanceFactor() <= 1 && root.balanceFactor() >= -1) rotate(root);
    BinarySearchTree.checkAndRotateRoots(root.parent.node);
  }
}

function checkAndRotateRoots(root) {
  if (root) {
    let x = root.balanceFactor();
    if (x > 1 || x < -1) rotate(root);
    checkAndRotateRoots(root.parent.node);
  }
}


function rotate(root) {
  //left-left and left-right
  if (root.balanceFactor() > 1) {
    //left-right scenario.
    if (root.left.balanceFactor() === -1) {
      leftRotate(root.left);
    }
      rightRotate(root);
  }
  else if (root.balanceFactor() < -1) {
    if (root.right.balanceFactor() === 1) rightRotate(root.right);
    leftRotate(root);
  }
  }

  //right-rotation.
  function rightRotate(root) {
    let pivot = root.left;
    if (pivot.right) {
      //establish right to be child of root's parent.
      pivot.right.parent.node = root;
      pivot.right.parent.side = 'left';
    }
    root.left = pivot.right;
    pivot.parent.node = root.parent.node;
    (root.parent.node) ? root.parent.node[root.parent.side] = pivot: pivot.parent.side = '';
    root.parent.node = pivot;
    root.parent.side = 'right';
    pivot.right = root;
  }

  function leftRotate(root) {
    let pivot = root.right;
    if (pivot.left) {
      //establish right to be child of root's parent.
      pivot.left.parent.node = root;
      pivot.left.parent.side = 'right';
    }
    root.right = pivot.left;
    pivot.parent.node = root.parent.node;
    (root.parent.node) ? root.parent.node[root.parent.side] = pivot: pivot.parent.side = '';
    root.parent.node = pivot;
    root.parent.side = 'left';
   pivot.left = root;
  }

let a = new BinarySearchTree(20);
let arrInserts = [15, 25, 16, 14, 17];
arrInserts.forEach(val => a.insert(val));
a.parent.node
