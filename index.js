/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Card(title, author) {
  this.title = title;
  this.author = author;
}
const c1 = new Card("HEY", "Bob");
console.log(c1.author);