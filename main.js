// TOP helper function
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    // Accept only arrays
    if (!(array instanceof Array)) {
      throw new Error('Error: Array required.');
    }
    // Keep original array
    this.originalArray = array;
    // Remove duplicates from and sort the original array;
    let noDuplicates = [];
    array.forEach((value) => {
      if (!noDuplicates.includes(value)) {
        noDuplicates.push(value);
      }
    });
    this.sortedArray = noDuplicates.sort((a, b) => a - b);
    this.root = this.buildTree();
  }

  buildTree() {
    const createBST = (array, start, end) => {
      if (start > end) {
        return null;
      }
      const mid = Math.round((start + end) / 2);
      const root = new Node(array[mid]);
      root.left = createBST(array, start, mid - 1);
      root.right = createBST(array, mid + 1, end);
      return root;
    };
    return createBST(this.sortedArray, 0, this.sortedArray.length - 1);
  }

  insert(value) {
    const insertValue = (value, root = this.root) => {
      if (root.left === null && value < root.data) {
        root.left = new Node(value);
        return;
      }
      if (root.right === null && value > root.data) {
        root.right = new Node(value);
        return;
      }
      if (value > root.data) {
        insertValue(value, root.right);
      } else {
        insertValue(value, root.left);
      }
    };
    insertValue(value);
  }

  delete(value) {
    const deleteValue = (value, root = this.root) => {
      if (root.data === value) {
        // Case 1 - leaf node
        if (root.left === null && root.right === null) {
          return null;
          // Case 2 - node with single child
        } else if (root.right === null) {
          return root.left;
        } else if (root.left === null) {
          return root.right;
          // Case 3 - node with both children
        } else {
          root = findInorderSuccessor(root, root.right);
          return root;
        }
      }
      if (value > root.data) {
        root.right = deleteValue(value, root.right);
      } else {
        root.left = deleteValue(value, root.left);
      }
      return root;
    };
    // Helper function for finding the next highest value recursively and modifying nodes accordingly
    const findInorderSuccessor = (root, currentNode) => {
      // Case 1 - the successor is immediately right to the root
      if (currentNode.left === null) {
        root.data = currentNode.data;
        if (currentNode.right) {
          root.right = currentNode.right;
        } else {
          root.right = null;
        }
        return root;
      }
      // Case 2 - the successor is somewhere to the left of the right subtree of the root
      const nextNextNode = currentNode.left.left;
      if (nextNextNode === null) {
        root.data = currentNode.left.data;
        if (currentNode.left.right) {
          currentNode.left = currentNode.left.right;
        } else {
          currentNode.left = null;
        }
        return root;
      }
      findInorderSuccessor(root, currentNode.left);
    };
    deleteValue(value);
  }

  find(value) {
    const findValue = (value, root = this.root) => {
      if (root === null) {
        return 'Value not found.';
      }
      if (value === root.data) {
        return root;
      }
      let node;
      if (value > root.data) {
        node = findValue(value, root.right);
      } else {
        node = findValue(value, root.left);
      }
      return node;
    };
    return findValue(value);
  }

  levelOrderIterative(callback = null) {
    const array = [];
    const queue = [this.root];
    while (queue.length > 0) {
      let node = queue.shift();
      array.push(node.data);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      if (callback) {
        callback(node);
      }
    }
    if (!callback) {
      return array;
    }
  }

  levelOrderRecursive(callback = null) {
    const breadthFirstSearch = (node, queue = [], array = []) => {
      if (!node) {
        return;
      }
      array.push(node.data);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      if (callback) {
        callback(node);
      }
      breadthFirstSearch(queue.shift(), queue, array);
      return array;
    };
    if (!callback) {
      return breadthFirstSearch(this.root);
    }
    breadthFirstSearch(this.root);
  }

  inOrder(callback = null) {
    const depthFirstSearch = (node, array = []) => {
      if (node === null) {
        return;
      }
      depthFirstSearch(node.left, array);
      array.push(node.data);
      if (callback) {
        callback(node);
      }
      depthFirstSearch(node.right, array);
      return array;
    };
    if (!callback) {
      return depthFirstSearch(this.root);
    }
    depthFirstSearch(this.root);
  }

  preOrder(callback = null) {
    const depthFirstSearch = (node, array = []) => {
      if (node === null) {
        return;
      }
      array.push(node.data);
      if (callback) {
        callback(node);
      }
      depthFirstSearch(node.left, array);
      depthFirstSearch(node.right, array);
      return array;
    };
    if (!callback) {
      return depthFirstSearch(this.root);
    }
    depthFirstSearch(this.root);
  }

  postOrder(callback = null) {
    const depthFirstSearch = (node, array = []) => {
      if (node === null) {
        return;
      }
      depthFirstSearch(node.left, array);
      depthFirstSearch(node.right, array);
      array.push(node.data);
      if (callback) {
        callback(node);
      }
      return array;
    };
    if (!callback) {
      return depthFirstSearch(this.root);
    }
    depthFirstSearch(this.root);
  }

  height(node) {
    // Return 0 if the node does not exist
    if (node === null) {
      return 0;
    }
    // Change tree root for the breadth-first search to work
    const originalRoot = this.root;
    this.root = node;
    // Find the last breadth-first search element of the node
    const lastElement = parseInt(this.levelOrderIterative().splice(-1, 1));
    // Bring back the original root
    this.root = originalRoot;
    // Perform binary search to find the last element, adding one to height per each recursive call
    const getHeight = (value, node) => {
      let height = 0;
      if (value === node.data) {
        return height;
      }
      height++;
      if (value > node.data) {
        height += getHeight(value, node.right);
      } else {
        height += getHeight(value, node.left);
      }
      return height;
    };
    return getHeight(lastElement, node);
  }

  depth(node) {
    // Perform binary search from the tree root to the node, adding one to depth per each recursive call
    const getDepth = (value, node = this.root) => {
      let depth = 0;
      if (value === node.data) {
        return depth;
      }
      depth++;
      if (value > node.data) {
        depth += getDepth(value, node.right);
      } else {
        depth += getDepth(value, node.left);
      }
      return depth;
    };
    return getDepth(node.data);
  }

  isBalanced() {
    const checkBalance = (node = this.root) => {
      if (node === null) {
        return true;
      }
      // Condition 1 - the height of the left and right tree for any node does not differ by more than 1
      if (Math.abs(this.height(node.left) - this.height(node.right)) > 1) {
        return false;
        // Condition 2 - the left subtree of that node is also balanced
      } else if (!checkBalance(node.left)) {
        return false;
        // Condition 3 - the right subtree of that node is also balanced
      } else if (!checkBalance(node.right)) {
        return false;
      }
      return true;
    };
    return checkBalance();
  }
}

const array0 = [1, 2, 3, 4];
const array1 = [0, 1, 2, 3, 4, 5, 6, 7];
const array2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

let tree = new Tree(array1);
// tree.insert(2);
// tree.insert(12);
// tree.insert(10);
// tree.insert(123);
// tree.insert(69);
// tree.insert(71);
// tree.insert(70);
// tree.insert(68);
// tree.delete(4);
// tree.delete(5);
// tree.delete(7);
// tree.delete(8);
// tree.delete(9);
// tree.delete(10);
// tree.delete(12);
// tree.delete(23);
// tree.delete(6345);
// tree.find(23);
// tree.levelOrderIterative((node) => {
//   if (node.data > 6) {
//     console.log(node.data);
//   }
// });
// tree.levelOrderIterative();
// tree.levelOrderRecursive((node) => {
//   if (node.data > 6) {
//     console.log(node.data);
//   }
// });
// tree.levelOrderRecursive();
// tree.inOrder((node) => {
//   if (node.data > 4) {
//     console.log(node.data * 3);
//   }
// });
// tree.inOrder();
// tree.preOrder((node) => {
//   if (node.data > 4) {
//     console.log(node.data * 3);
//   }
// });
// tree.preOrder();
// tree.postOrder((node) => {
//   if (node.data > 4) {
//     console.log(node.data * 3);
//   }
// });
// tree.postOrder();
prettyPrint(tree.root);
// console.log(tree.height(tree.root));
// console.log(tree.depth(tree.root));
console.log(tree.isBalanced());
