const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, hapi) => {
  const {title = 'untitled', tags, body} = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title: title,
    tags: tags,
    body: body,
    id: id,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = hapi.response({
      status: 'success',
      message: 'item berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = hapi.response({
    status: 'failed',
    message: 'item gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllNotes = () => ({
  status: 'success',
  data: {
    notes: notes,
  },
});

const getNoteById = (req, hapi) => {
  const {id} = req.params;

  const note = notes.filter((note) => note.id == id)[0];

  if (note != undefined) {
    return {
      status: 'success',
      data: {
        notes: note,
      },
    };
  }

  const response = hapi.response({
    status: 'failed',
    message: 'Note tidak ada',
  });

  return response;
};

const editNoteById = (req, hapi) => {
  const {id} = req.params;

  const {title, tags, body} = req.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id == id);

  if (index != -1) {
    notes[index] = {
      ...notes[index],
      title: title,
      tags: tags,
      body: body,
      updatedAt: updatedAt,
    };

    const response = hapi.response({
      status: 'success',
      message: 'note berhasil diedit',
    });

    response.code(200);
    return response;
  }

  const response = hapi.response({
    status: 'failed',
    message: 'Note tidak ada',
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (req, hapi) => {
  const {id} = req.params;

  const index = notes.findIndex((note) => note.id == id);

  if (index != -1) {
    notes.splice(index, 1);

    const response = hapi.response({
      status: 'success',
      message: 'item berhasil dihapus',
    });

    response.code(200);

    return response;
  }

  const response = hapi.response({
    status: 'failed',
    message: 'Note tidak ada',
  });

  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotes,
  getNoteById,
  editNoteById,
  deleteNoteByIdHandler,
};
