const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  /* mengambil data yang dikirim client melalui body */
  const { title, tags, body } = request.payload;
  /* Generate id menggunakan library nano */
  const id = nanoid(16);
  /* Generate date */
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  /* Simpan nilai diatast ke dalam array notes yang ada pada file notes.js */
  const newNotes = {
    /* jika nama properti sama dengan nama variabel yang digunakan untuk mengisi properti, maka nama propertinya tidak perlu ditulis */
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };
  notes.push(newNotes);
  /* Cek apakah notes berhasil ditambah */
  const isSuccess =
    notes.filter((note) => {
      return note.id === id;
    }).length > 0;
  /* Menentukan respon server */
  if (isSuccess) {
    const response = h
      .response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId: id,
        },
      })
      .code(201);
    return response;
  } else {
    const response = h
      .response({
        status: "error",
        message: "Catatan gagal untuk ditambahkan",
      })
      .code(500);
    return response;
  }
};

const getAllNotesHandler = () => {
  /* parameter request dan h tidak perlu ditulis karena tidak digunakan pada fungsi ini */
  return {
    status: "success",
    data: {
      notes,
    },
  };
};

const getNotesByIdHandler = (request, h) => {
  /* Mengambil id pada params path */
  const { id } = request.params;
  /* Menggunakan filter untuk mencari notes dengan id yang telah diambil dari params */
  const note = notes.filter((n) => {
    return n.id === id;
    /* notes merupakan array of object. Filter akan mengembalikan 1 buah array yang berisi data note sesuai dengan id yang dikirim pada params berbentuk object. Karena filter mengembalikan nilai array, untuk mendapatkan hanya object nya saja perlu ditambahkan index nol di akhir fungsi filter seperti berikut ini */
  })[0];
  /* Jika note tidak undefined maka return notenya */
  if (note !== undefined) {
    const response = h
      .response({
        status: "success",
        data: {
          note,
        },
      })
      .code(200);
    return response;
  } else {
    const response = h
      .response({
        status: "fail",
        message: "Catatan tidak ditemukan",
      })
      .code(404);
    return response;
  }
};

const editNotesByIdHandler = (request, h) => {
  const { id } = request.params;
  /* Tangkap data yang diupdate user melalui payload */
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  /* Cari index notes yang kaan diupdate dengan memanfaatkan id notes */
  const index = notes.findIndex((n) => {
    return n.id === id;
  });
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h
      .response({
        status: "success",
        message: "Catatan berhasil diperbarui",
      })
      .code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui catatan. Id catatan tidak ditemukan",
    });
    return response;
  }
};

const deleteNotesById = (request, h) => {
  /* ambil id dari params path */
  const { id } = request.params;
  const index = notes.findIndex((n) => {
    return n.id === id;
  });
  if (id !== -1) {
    notes.splice(index, 1);
    const response = h
      .response({
        status: "success",
        message: "Catatan berhasil dihapus",
      })
      .code(200);
    return response;
  } else {
    const response = h
      .response({
        status: "fail",
        message: "Catatan gagal dihapus. Id catatan tidak ditemukan",
      })
      .code(404);
    return response;
  }
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotesByIdHandler,
  editNotesByIdHandler,
  deleteNotesById,
};
