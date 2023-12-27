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
    if (!(array instanceof Array)) {
      throw new Error('Error: Array required.');
    }
    this.originalArray = array;
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
    return createBST(this.array, 0, this.array.length - 1);
  }
}

const array0 = [1, 2, 3, 4];
const array1 = [0, 1, 2, 3, 4, 5, 6, 7];
const array2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

let tree = new Tree(array1);
prettyPrint(tree.root);
