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
          // Normal case (there is at least one node in root.right.left)
          if (root.right.left !== null) {
            root.data = findInorderSuccessor(root.right);
            // Abnormal case (root.right.left === null)
          } else {
            root.data = root.right.data;
            root.right = root.right.right;
          }
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
    const findInorderSuccessor = (currentNode) => {
      const nextNextNode = currentNode.left.left;
      if (nextNextNode === null) {
        let value = currentNode.left.data;
        if (currentNode.left.right) {
          currentNode.left = currentNode.left.right;
        } else {
          currentNode.left = null;
        }
        return value;
      }
      const value = findInorderSuccessor(currentNode.left);
      return value;
    };
    deleteValue(value);
  }
}

const array0 = [1, 2, 3, 4];
const array1 = [0, 1, 2, 3, 4, 5, 6, 7];
const array2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

let tree = new Tree(array2);
tree.insert(2);
tree.insert(12);
tree.insert(10);
tree.insert(123);
tree.insert(69);
tree.insert(71);
tree.insert(70);
tree.insert(68);
// tree.delete(8);
// tree.delete(9);
// tree.delete(10);
// tree.delete(12);
// tree.delete(23);
prettyPrint(tree.root);
