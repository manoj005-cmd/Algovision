import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Sorting Algorithms
  {
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    correctAnswer: "O(n^2)",
    explanation: "Quick Sort's worst-case is O(n^2), which occurs when the pivot choices are consistently poor, such as on an already sorted or reverse-sorted array."
  },
  {
    question: "Which of the following sorting algorithms is stable?",
    options: ["Quick Sort", "Heap Sort", "Selection Sort", "Merge Sort"],
    correctAnswer: "Merge Sort",
    explanation: "A stable sort maintains the relative order of equal elements. Merge Sort is stable, while Quick Sort, Heap Sort, and Selection Sort are not inherently stable."
  },
  {
    question: "What is the best-case time complexity for Insertion Sort?",
    options: ["O(n)", "O(n^2)", "O(n log n)", "O(1)"],
    correctAnswer: "O(n)",
    explanation: "Insertion Sort's best-case scenario is an already sorted array, where it only needs to make a single pass, resulting in O(n) time complexity."
  },
  {
    question: "Merge Sort's time complexity in all cases is:",
    options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"],
    correctAnswer: "O(n log n)",
    explanation: "Merge Sort consistently divides the array in half and merges, giving it a time complexity of O(n log n) in the best, average, and worst cases."
  },
  {
    question: "Selection Sort is known for making the minimum possible number of...",
    options: ["Comparisons", "Swaps", "Passes", "Partitions"],
    correctAnswer: "Swaps",
    explanation: "Selection Sort makes O(n) swaps, which is the minimum for any comparison-based sort, as it only swaps an element into its final position once."
  },
  {
    question: "Which data structure is primarily used by Heap Sort?",
    options: ["Stack", "Queue", "Binary Heap", "Hash Table"],
    correctAnswer: "Binary Heap",
    explanation: "Heap Sort uses a Binary Heap data structure to efficiently find the maximum (or minimum) element in the array."
  },
  {
    question: "Which of these sorting algorithms is NOT an in-place sort?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: "Merge Sort",
    explanation: "Merge Sort requires auxiliary space proportional to the input array size (O(n)) to merge the sorted halves, so it is not an in-place algorithm."
  },
  {
    question: "What is the average time complexity of Bubble Sort?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    correctAnswer: "O(n^2)",
    explanation: "Bubble Sort has an average and worst-case time complexity of O(n^2) because of its nested loops that compare and swap adjacent elements."
  },
  {
    question: "For which of the following is Selection Sort a good choice?",
    options: ["When memory writes are costly", "For very large datasets", "For nearly sorted data", "When stability is required"],
    correctAnswer: "When memory writes are costly",
    explanation: "Since Selection Sort performs a minimal number of swaps (O(n)), it is advantageous in scenarios where writing to memory is an expensive operation."
  },
  {
    question: "The efficiency of Quick Sort heavily depends on the choice of the:",
    options: ["Array size", "Pivot element", "First element", "Number of swaps"],
    correctAnswer: "Pivot element",
    explanation: "A good pivot choice splits the array into roughly equal halves, leading to O(n log n) performance. A poor pivot leads to the O(n^2) worst case."
  },
  // Searching Algorithms
  {
    question: "What is a key prerequisite for performing a Binary Search?",
    options: ["The array must be sorted", "The array must contain unique elements", "The array must be small", "The array must contain only integers"],
    correctAnswer: "The array must be sorted",
    explanation: "Binary Search works by repeatedly dividing the search interval in half. This is only possible if the array's elements are in sorted order."
  },
  {
    question: "What is the worst-case time complexity of a Linear Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    correctAnswer: "O(n)",
    explanation: "The worst-case for Linear Search is when the target element is at the very end of the array or not in the array at all, requiring n comparisons."
  },
  {
    question: "The average time complexity for a successful search in a Hash Table is:",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation: "With a good hash function, a Hash Table can provide average constant-time O(1) for search, insertion, and deletion operations."
  },
  {
    question: "In a sorted array of 16 elements, what is the maximum number of comparisons a Binary Search will perform?",
    options: ["16", "8", "4", "5"],
    correctAnswer: "4",
    explanation: "Binary search's complexity is O(log n). log2(16) is 4, so it takes at most 4 comparisons to find an element in an array of 16 items."
  },
  {
    question: "When is Linear Search preferable to Binary Search?",
    options: ["On a very large, sorted array", "On a small, unsorted array", "When the target is always in the middle", "Never"],
    correctAnswer: "On a small, unsorted array",
    explanation: "For small arrays, the overhead of sorting for Binary Search is not worth it. Linear Search is simpler and efficient enough on small, unsorted datasets."
  },
  // Data Structures - Linear
  {
    question: "A Stack follows which principle?",
    options: ["First-In, First-Out (FIFO)", "Last-In, First-Out (LIFO)", "First-In, Last-Out (FILO)", "Last-In, Last-Out (LILO)"],
    correctAnswer: "Last-In, First-Out (LIFO)",
    explanation: "A Stack is a LIFO structure. The last element added to the stack is the first one to be removed, like a stack of plates."
  },
  {
    question: "A Queue follows which principle?",
    options: ["Last-In, First-Out (LIFO)", "First-In, First-Out (FIFO)", "Last-In, Last-Out (LILO)", "Random Access"],
    correctAnswer: "First-In, First-Out (FIFO)",
    explanation: "A Queue is a FIFO structure. The first element added to the queue is the first one to be removed, like a line of people waiting."
  },
  {
    question: "Which operation is more efficient in a Doubly Linked List compared to a Singly Linked List?",
    options: ["Accessing the first element", "Inserting a new node at the beginning", "Traversing the list forward", "Deleting a given node"],
    correctAnswer: "Deleting a given node",
    explanation: "In a Doubly Linked List, each node has a pointer to the previous node, allowing for efficient deletion of a node without needing to traverse from the head."
  },
  {
    question: "Which of the following is a primary use case for a Stack?",
    options: ["Managing requests on a server", "Serving a printer queue", "Implementing function calls (call stack)", "A playlist in a music app"],
    correctAnswer: "Implementing function calls (call stack)",
    explanation: "The call stack manages active subroutines (function calls). When a function is called, it's pushed onto the stack, and when it returns, it's popped off."
  },
  {
    question: "What is the term for adding an element to a queue?",
    options: ["Push", "Pop", "Enqueue", "Dequeue"],
    correctAnswer: "Enqueue",
    explanation: "Enqueue is the operation of adding an element to the rear of the queue."
  },
  {
    question: "What is a major advantage of a Linked List over an Array?",
    options: ["Constant time access to elements", "Dynamic size and efficient insertions/deletions", "Better cache locality", "Less memory usage per element"],
    correctAnswer: "Dynamic size and efficient insertions/deletions",
    explanation: "Linked lists can grow and shrink dynamically, and inserting or deleting a node is very efficient (O(1)) if you have a pointer to the location."
  },
  {
    question: "What is the term for removing an element from a stack?",
    options: ["Dequeue", "Pop", "Peek", "Remove"],
    correctAnswer: "Pop",
    explanation: "Pop is the operation of removing the topmost element from the stack."
  },
  {
    question: "Memory allocation for an Array is typically:",
    options: ["Contiguous", "Random", "Linked", "Hashed"],
    correctAnswer: "Contiguous",
    explanation: "Elements of an array are stored in a single, continuous block of memory, which allows for efficient indexed access but makes resizing costly."
  },
  {
    question: "A data structure that allows insertion and deletion at both ends is called a:",
    options: ["Stack", "Queue", "Priority Queue", "Deque"],
    correctAnswer: "Deque",
    explanation: "A Deque, or double-ended queue, is a generalized version of a queue that supports adding and removing elements from both the front and the rear."
  },
  {
    question: "Accessing an element by its index in an array has a time complexity of:",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation: "Because array memory is contiguous, the position of any element can be calculated directly from its index, allowing for constant time access."
  },
  // Data Structures - Trees & Graphs
  {
    question: "In a Binary Search Tree (BST), which statement is always true for any node?",
    options: ["All nodes in its left subtree are smaller", "It is perfectly balanced", "All nodes in its right subtree are smaller", "It has at most one child"],
    correctAnswer: "All nodes in its left subtree are smaller",
    explanation: "The core property of a BST is that for any given node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater."
  },
  {
    question: "Which tree traversal visits the left subtree, then the root, then the right subtree?",
    options: ["Pre-order", "Post-order", "In-order", "Level-order"],
    correctAnswer: "In-order",
    explanation: "In-order traversal follows the Left-Root-Right pattern. For a BST, this traversal visits the nodes in ascending order."
  },
  {
    question: "A tree node with no children is called a:",
    options: ["Root node", "Parent node", "Internal node", "Leaf node"],
    correctAnswer: "Leaf node",
    explanation: "Leaf nodes (or external nodes) are the nodes at the very bottom of the tree that do not have any children."
  },
  {
    question: "The top-most node in a tree is called the:",
    options: ["Leaf", "Parent", "Root", "Child"],
    correctAnswer: "Root",
    explanation: "The root is the single node at the highest level of the tree from which all other nodes descend."
  },
  {
    question: "What does an AVL tree do to maintain its balance?",
    options: ["Colors nodes red or black", "Performs rotations", "Uses a hash function", "Keeps the tree as full as possible"],
    correctAnswer: "Performs rotations",
    explanation: "AVL trees are self-balancing BSTs that perform 'rotations' (like left or right rotations) to ensure the height difference between left and right subtrees never exceeds one."
  },
  {
    question: "Which data structure is typically used to implement a Breadth-First Search (BFS) on a graph?",
    options: ["Stack", "Queue", "Heap", "Array"],
    correctAnswer: "Queue",
    explanation: "BFS explores a graph level by level. A queue (FIFO) is used to keep track of the nodes to visit next, ensuring that nodes at the current level are processed before moving to the next level."
  },
  {
    question: "A Max-Heap is a binary tree where every parent node is:",
    options: ["Less than or equal to its children", "Greater than or equal to its children", "Equal to the sum of its children", "A prime number"],
    correctAnswer: "Greater than or equal to its children",
    explanation: "This is the 'heap property' for a Max-Heap. The largest element is always at the root, making it efficient for implementing priority queues."
  },
  {
    question: "A path in a graph that starts and ends at the same vertex is called a:",
    options: ["Loop", "Edge", "Cycle", "Tree"],
    correctAnswer: "Cycle",
    explanation: "A cycle is a path of edges and vertices in which a vertex is reachable from itself."
  },
  {
    question: "Which data structure is typically used to implement a Depth-First Search (DFS) on a graph?",
    options: ["Queue", "Stack", "Linked List", "Adjacency Matrix"],
    correctAnswer: "Stack",
    explanation: "DFS explores as far as possible along each branch before backtracking. A stack (LIFO) is used (often implicitly via recursion) to keep track of the path."
  },
  {
    question: "The space complexity of an Adjacency Matrix for a graph with V vertices is:",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V^2)"],
    correctAnswer: "O(V^2)",
    explanation: "An adjacency matrix uses a V x V grid to represent connections, regardless of the number of edges (E), so its space complexity is always O(V^2)."
  },
  // Complexity & General Concepts
  {
    question: "Big O notation is used to describe an algorithm's:",
    options: ["Exact running time", "Memory usage", "Worst-case performance and scalability", "Ease of implementation"],
    correctAnswer: "Worst-case performance and scalability",
    explanation: "Big O notation describes the upper bound of an algorithm's complexity, indicating how its performance scales as the input size (n) grows."
  },
  {
    question: "An algorithm with O(1) time complexity is called:",
    options: ["Linear Time", "Logarithmic Time", "Constant Time", "Quadratic Time"],
    correctAnswer: "Constant Time",
    explanation: "O(1) means the algorithm's execution time is constant and does not change with the size of the input data."
  },
  {
    question: "A function that calls itself is known as:",
    options: ["Iterative", "Recursive", "Complex", "Dynamic"],
    correctAnswer: "Recursive",
    explanation: "Recursion is a technique where a function solves a problem by calling itself with smaller or simpler versions of the same problem."
  },
  {
    question: "The measure of the amount of memory an algorithm uses is called:",
    options: ["Time Complexity", "Space Complexity", "Cache Performance", "Big O Notation"],
    correctAnswer: "Space Complexity",
    explanation: "Space complexity analyzes the total memory space required by an algorithm, including both the input and any auxiliary memory it uses."
  },
  {
    question: "An algorithm that makes the locally optimal choice at each step is called a:",
    options: ["Greedy algorithm", "Divide and conquer algorithm", "Dynamic programming algorithm", "Brute-force algorithm"],
    correctAnswer: "Greedy algorithm",
    explanation: "A greedy algorithm builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit."
  },
  {
    question: "Dynamic Programming is a technique that typically involves:",
    options: ["Random choices", "Making a locally optimal choice", "Solving subproblems and storing their results", "Using a stack"],
    correctAnswer: "Solving subproblems and storing their results",
    explanation: "Dynamic Programming solves complex problems by breaking them down into simpler subproblems, solving each subproblem just once, and storing their solutions."
  },
  {
    question: "What does 'n' represent in Big O notation like O(n)?",
    options: ["The number of operations", "The size of the input", "The speed of the computer", "A constant value"],
    correctAnswer: "The size of the input",
    explanation: "'n' is used to represent the number of items in the input, such as the number of elements in an array or nodes in a tree."
  },
  {
    question: "Which of these has the best (most efficient) time complexity for very large datasets?",
    options: ["O(n^2)", "O(n)", "O(n log n)", "O(log n)"],
    correctAnswer: "O(log n)",
    explanation: "Logarithmic time O(log n) grows very slowly. For large n, it is significantly more efficient than linear O(n), log-linear O(n log n), and quadratic O(n^2) time."
  },
  {
    question: "A step-by-step procedure for solving a problem is known as:",
    options: ["A Data Structure", "A Variable", "An Algorithm", "A Class"],
    correctAnswer: "An Algorithm",
    explanation: "An algorithm is a finite sequence of well-defined, computer-implementable instructions to solve a class of problems or to perform a computation."
  },
  {
    question: "What is the primary difference between an algorithm and a data structure?",
    options: ["There is no difference", "An algorithm is a procedure, while a data structure is a way of organizing data", "A data structure is a procedure, while an algorithm is a way of organizing data", "Algorithms are for sorting, data structures are for searching"],
    correctAnswer: "An algorithm is a procedure, while a data structure is a way of organizing data",
    explanation: "A data structure (like an array or linked list) is a format for organizing, managing, and storing data. An algorithm (like Quick Sort) is a set of steps to perform a task."
  }
];
