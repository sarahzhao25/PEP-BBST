AVL Trees and Where To Rotate Them
By Sarah Zhao

When I first learned about binary search trees, I was very excited to implement my own, but reality set in when I learned that it was possible for a BST to be completely useless when your inputs are sorted. While it appears that randomly selected inputs provide the closest semblance of a tree that is even on both sides, it is still not guaranteed. And I like logical guarantees.

So I decided I wanted to make it happen. By using AVL trees, which are one of many types of height-balanced binary search trees, we're going to go from this (photo of unbalanced tree) to this (photo of better balanced tree). Two different properties will be added to my BST constructor: a link to the parent node, and a height. The height of a tree is the longest path from root node to any leaf node. In this particular post, we will be working exclusively with inserting nodes, and rotating nodes when the AVL rules are violated.

The AVL rules are as follows:
1. A tree is height-balanced when the heights of its child trees differ by at most 1.

2. For convention, we will decide the left child tree as the former, and the resulting difference, otherwise known as the `balance factor` has to be in the range of [-1, 1] where -1 will be an extra node on the right child tree, and 1 is an extra node on the left child tree. These situations account for an odd number of nodes.

3. When the balance factor is outside that range during insertion or deletion, the tree is considered unbalanced, and will need to undergo rotations to be rebalanced. There are 4 different categories of rotations: left-left, left-right, right-right, and right-left.

4. The resulting `height` of the tree is then log2(n), which will make traversal time O(log2(n)).

Now, looking at those rules, you might be wondering: why do I care? Why go through all of this extra effort just to make a tree look more like its namesake?

The easiest way to look at it would be with a large data set. With smaller data sets, the lookup time for a regular tree and a balanced tree is similar, but when your data sets become thousands of nodes deep, or even tens of thousands, suddenly the range of possibility is at best O(lg n) and at worst O(n), or that of traversing a linked list. With a balanced BST, you can always guarantee O(lg n) lookup time in both average and worst-case scenarios.

Visual Example:

Let’s take a look at the initial example of creating a BST of 20 as its root, and then inserting the following: [15, 25, 10, 7, 18, 12, 11]

The rules for a BST are as follows: all values <= root go to the left, else move to the right.

The first insertion will place 15 to the left of 20. The only parent is 20, whose height will be 1, and balance factor is 1.

These second insertion will place 25 to the right of 20. The only parent is 20, whose height is 1, and balance factor is 0.

The third insertion places 14 to the left of 15. 15 has a height of 1, and balance factor of 1. 20 has a height of 2 and a balance factor of 1.

The fourth insertion places 10 to the left of 14. 14 has a height of 1 and balance factor of 1. 15 has a height of 2, and a balance factor of 2. This then violates the rule of an AVL tree needing to have a balance factor between -1 and 1. The resulting situation forces a ‘rotation’, specifically a ‘right rotation’. The case occurs when the node in question - the root node (15) is unbalanced, and its left side is longer than the other. The rotation will come from the side that is longer - the left side. The root’s left node (14) is known as the ‘pivot’ node. This node will determine whether the rotation will be right or left depending on whether it has a balance factor of 1. If it has a balance factor of 1, then the left side is longer than the right, and this situation is known as a ‘left-left’, for the left node as a pivot, and the longer left side, which will force a right rotation. The ‘root’ node will move to the ‘pivot’ node’s right side, and the pivot node will be directly attached to the rest of the tree. If the ‘pivot’ node had a right side, it will move to the root node’s left.

The same situation on the other end is known as a ‘right-right’, causing a ‘left’ rotation.

The other 2 scenarios are ‘left-right’ and ‘right-left’. There will be 2 resulting rotations instead of 1, as explained below:

The opposite situation is if 14.5 were placed instead of 10. Now the ‘pivot’ node has a balance factor of -1, which is going to cause a left rotation using the pivot node as the root node, and its right node as the pivot. Once that is complete, the second rotation is a right rotation with the original root node and the new pivot node. Both of these rotations have already been defined above. The mirrored situation results in the ‘right-left’ rotations.

Once the designated nodes are set, the rest of the tree is re-calculated to ensure the height-balance.

These are the general rules of an AVL tree in particular. There are many other methods to a height-balanced tree, and even algorithms to optimize the height of the tree over a given amount of time.

Putting words into actions as follows:



Code Base Understanding:

To determine the height of a tree, the method that I chose was recursive. I declared a function ‘height’ that returned -1 if the root is null, and otherwise called the maximum of the tree’s left and right sub-tree heights + 1.

```JS
BinarySearchTree.prototype.height = function(treeNode) {
 return (treeNode === null) ? -1 : Math.max(this.height(treeNode.left), this.height(treeNode.right)) + 1;
};
```

With the height method available, I can then determine the balance factor of each of my successive parent nodes after the insertion of a leaf node.

Part 1: Insertion of a leaf node:
The codeblock of the `insert` prototype method takes the new value, and performs a recursive call until it hits a node with no corresponding right/left. After inserting the node, it performs this function on the node, now aliased as `root`:

```JS
function checkAndRotateRoots(root) {
 if (root) {
   let x = root.balanceFactor();
   if (x > 1 || x < -1) BinarySearchTree.rotate(root);
   checkAndRotateRoots(root.parent.node);
 }
}
```

Walking through this: if the root’s balance factor is outside of the balance range, it will need to be rotated. Otherwise, until the root no longer exists, this function will recursively check the parent node.


Let’s go into the rotation process.  So, the idea here is that the nodes will either move left or right (imagine a 45 degree diagonal plane for this) depending on the status of its balanceFactor. The 4 main rotations take into account the 4 possible positions of unbalanced situations: the first two consider whether the unbalanced situation is left-heavy or right-heavy, and then each following situation is either left-heavy or right-heavy.

```js
//left-heavy subtree will result in a `rightRotate`
 if (root.balanceFactor() > 1) {
   //if the subtree itself is right-heavy, there will first be a right-rotation.
   if (root.left.balanceFactor() === -1) {
     leftRotate(root.left);
   }
     rightRotate(root);
 }
//mirrored situation applies for the `leftRotate` in a right-heavy subtree.
 else if (root.balanceFactor() < -1) {
   if (root.right.balanceFactor() === 1) rightRotate(root.right);
   leftRotate(root);
 }
 }
```

Note that because the balanceFactor is >0 or <0, there is automatically going to be a child node on either side, so there is no need to verify if there exists a left or right root.

Now that we have been able to establish the direction of the rotation, now we can perform the rotation itself. I will examine the right-rotation, as the right rotation is a mirroed version in its code.

```js
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
```

Here, we need to understand that a BST has the following in its constructor:
```JS
function BinarySearchTree(value) {
 this.value = value;
 this.left = this.right = null;
 this.parent = {node: null, side: ''};
}
```
And note that the BST rotation requires a `pivot` node in addition to the `root` node from the first portion of our talk.

With these pieces in mind, let’s walk through the workflow.
We are on Step 5 of inserting into the tree, where we have hit our first unbalanced scenario: we’ve inserted 7 into the tree, and now our tree is left-heavy. As we perform `checkAndRotateRoots` through our node and its parents, we find the following:
7 has a height balance of 0, 10 has a height balance of 1, and 15 has a height balance of 2.

So on 15, we will need to perform `rotate`.
15's height balance is left-heavy, and its left subtree (10) is also left-heavy. This results in 1 rotation: a right-rotate on the root(15).

Now comes the fun part: rotation and re-assignment!! Here is what the tree looks like:
ROOT: Tree(15) => value: 15, leftheight: 2, rightheight: 0, left: 10, right: null, parent: {node: Tree(20), side: 'left'}

PIVOT: Tree(10) => value: 10, leftheight: 1, rightheight: 0, left: 7, right: null, parent: {node: Tree(15), side: 'left'}

PARENT: Tree(20) => value: 20, leftheight: 3, rightheight: 1, left: 15, right: 25, parent: null

So as we can see, there are several relationships here that we have to be wary of when we are changing, so we will run through them as we are walking through the code.

So in order to rotate right, 15 will move to the right, and 10 will take its place. This will re-establish the following:
10's parent is now going to be Tree(20), and Tree(20)'s new left is going to be 10. 10's right will be 15, and 15's parent will be 10. 15's left will no longer be parent, but be null. If 10 had a right child, that will become 15's left.

So the code as follows:
If 10 had a right (pivot.right), the right's parent node will be the root node  (15).
To continue:
The root node's NEW left will be pivot.right. Since 10 does not have a right, this will be null.
10's new parent node is 20. As long as there is a parent node, the side will also be changed.

The root's new parent node is the original pivot.
And the pivot's right is now the root.

This takes care of all of the relationships included.

The same will apply for a right-rotation. For left-rights and right-lefts, the rotations themselves are the same.

For this particular scenario, a BST is defined with a value, a root. This current application will rotate the tree, and the diagram of the tree will be rendered as such. However, should the tree need to rotate its root node, the tree itself will remain the same, except that the root node will now be off-center. There are other ways to approach creating a BST where we start with an empty tree, and insert values with a pointer to the root node.

Thank you, and please let me know if you have any questions!

Sarah
