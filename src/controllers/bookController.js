const Book = require('../models/bookModel');
const User = require('../models/userModel');

exports.addBook = async (request, reply) => {
  try {
    const userId = request.user.id;
    let book = {};
    const user = await User.findByPk(userId);
    if (!user) {
      return reply.code(404).send({ error: 'User not found.' });
    }

    const { title, author, library_id=0, description } = request.body;
    created_at = new Date(); 
    const existing_book = await Book.findOne({ where: { title: title, author: author } });
    if (existing_book === null) {
      book = await Book.create(
        {
          title: title, author: author, library_id: library_id, owner_id: userId, description: description
        }
      );
    } else {
      throw new Error("There was an issue creating the book");
    }
    reply.code(200).send(book);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

exports.editBook = async (request, reply) => {
  try {
    const userId = request.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return reply.code(404).send({ error: 'User not found for this book.' });
    }

    const { id, title, author, owner_id, library_id, description } = request.body;
    const previous_book_data = await Book.findByPk(id);
    
    if (!previous_book_data) {
      return reply.code(404).send({ error: 'This book does not exist.' });
    }
    
    await Book.update(
      {
        title: title, author: author, library_id: library_id, owner_id: owner_id, description: description
      },
      {
        where: { 
          id: previous_book_data.id, owner_id: owner_id
      }
    });

    reply.code(201).send(await Book.findByPk(id));
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

exports.getBookById = async (request, reply) => {
  try {
    const { id } = request.params;
    const book = await Book.findOne({
      where: { id: id }
    });
    reply.code(200).send(book);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

exports.getAllBooks = async (request, reply) => {
  try {
    const book = await Book.findAll();
    reply.code(200).send(book);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

exports.getUserBooks = async (request, reply) => {
  try {
    // Extracted from JWT
    const userId = request.user.id;
    
    // Find user by email
    const user = await User.findByPk(userId);
    
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    
    const books = await Book.findAll({where: {owner_id: user.id }});
    reply.code(201).send(books);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

exports.getLibraryBooks = async (request, reply) => {
  try {
    // Extracted from JWT
    const userId = request.user.id;
    
    // Find user by email
    const user = await User.findByPk(userId);
    
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    
    const books = await Book.findAll();
    reply.code(201).send(books);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

/*

exports.postBorrowBook('/borrow', async (request, reply) => {
  try {
      const { book_id, borrower_id, return_by_date } = request.body;
      // Extracted from JWT
      const userId = request.user.id;
      // Find user by email
      const user = await User.findByPk(userId);
  
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Check if the book exists
      const book = await Book.findByPk(book_id);
      if (!book) return reply.code(404).send({ error: 'Book not found' });

      // Check if the book is already borrowed
      if (book.borrowed) {
        return reply.code(400).send({ error: 'Book is already borrowed' });
      }
  
      return reply.code(201).send({ message: 'Book borrowed successfully' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  

  fastify.get('/borrowed-books', async (request, reply) => {
    try {
      const borrowedBooks = await BorrowedBook.findAll({
        include: [
          { model: Book, as: 'book', attributes: ['title', 'author'] },
          { model: User, as: 'borrower', attributes: ['name', 'email'] }
        ]
      });
  
      return reply.send(borrowedBooks);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  */