const { nanoid } = require("nanoid");
const db = require("./firebase");
const { messaging } = require("firebase-admin");

const registerHandler = async (request, h) => {
  const { namalengkap, nomortelp, email, password } = request.payload;
  const user_id = nanoid(10);

  if (!namalengkap || !nomortelp || !email || !password) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan user. Lengkapi data!",
    });
    response.code(400);
    return response;
  }
  const newuser = {
    user_id,
    namalengkap,
    nomortelp,
    email,
    password,
  };

  try {
    await db.collection("USER").doc(user_id).set(newuser);
    return h
      .response({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          user: newuser,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "User gagal ditambahkan",
        error: error.message,
      })
      .code(500);
  }
};

const addTukang = async (request, h) => {
  const tukang_id = nanoid(10);
  const photoUrl = "https://i.pravatar.cc/300https://i.pravatar.cc/300";
  const { namatukang, spesialis, review, booked } = request.payload;
  const newtukang = { tukang_id, namatukang, spesialis, review, booked, photoUrl };
  if (!namatukang || !spesialis || !review) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan tukang. Lengkapi data!",
    });
    response.code(400);
    return response;
  }

  try {
    await db.collection("TUKANG").doc(tukang_id).set(newtukang);
    return h
      .response({
        status: "success",
        message: "Tukang berhasil ditambahkan",
        data: {
          tukang: newtukang,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Tukang gagal ditambahkan",
        error: error.message,
      })
      .code(500);
  }
};

const getAlluser = async (request, h) => {
  try {
    const usersSnapshot = await db.collection("USER").get();
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return h
      .response({
        status: "success",
        listUser: users,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "User gagal ditambahkan",
        error: error.message,
      })
      .code(500);
  }
};

const getAllTukang = async (request, h) => {
  try {
    const snapshotTukang = await db.collection("TUKANG").get();
    const tukangs = snapshotTukang.docs.map((doc) => doc.data());
    return h
      .response({
        status: "success",
        tukang : tukangs,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Tukang gagal ditambahkan",
        error: error.message,
      })
      .code(500);
  }
};

const getDataBeranda = async (request, h) => {
  const { user_id } = request.params;

  try {
    const userDoc = await db.collection("USER").doc(user_id).get();
    if (!userDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "User tidak ditemukan",
      });
      response.code(404);
      return response;
    }
    const user = userDoc.data();

    const tukangSnapshot = await db.collection("TUKANG").where("booked", "==", false).get();
    const tukangs = tukangSnapshot.docs.map((doc) => doc.data());

    const response = h.response({
      status: "success",
      data: {
        namalengkap: user.namalengkap,
        tukangs: tukangs.map((tukang) => ({
          namatukang: tukang.namatukang,
          spesialis: tukang.spesialis,
        })),
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "User gagal ditemukan",
      error: error.message,
    });
    response.code(500);
    return response;
  }
};

const getDetailProfile = async (request, h) => {
  const { user_id } = request.params;
  try {
    const usersSnapshot = await db.collection("USER").doc(user_id).get();
    if (!usersSnapshot.exists) {
      const response = h.response({
        status: "fail",
        message: "User tidak ditemukan",
      });
      response.code(404);
      return response;
    }
    const users = usersSnapshot.data();
    const response = h.response({
      status: "success",
      users,

    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "User gagal ditemukan",
      error: error.message,
    });
    response.code(404);
    return response;
  }
};

const searchHandler = async (request, h) => {
  const { namatukang } = request.query;

  try {
    const tukangRef = db.collection("TUKANG");
    let tukangSnapshot;
    if (namatukang) {
      tukangSnapshot = await tukangRef
        .where("namatukang", ">=", namatukang)
        .where("namatukang", "<=", namatukang + "\uf8ff")
        .get();
      if (tukangSnapshot.empty) {
        tukangSnapshot = await tukangRef
          .where("namatukang", ">=", namatukang)
          .where("namatukang", "<=", namatukang + "\uf8ff")
          .get();
      }
    } else {
      tukangSnapshot = await tukangRef.get();
    }

    const tukangs = tukangSnapshot.docs.map((doc) => doc.data());
    const response = h.response({
      status: "success",
      data: {
        tukangs,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Tukang gagal ditemukan",
      error: error.message,
    });
    response.code(404);
    return response;
  }
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  if (!email || !password) {
    return h
      .response({
        status: "fail",
        message: "Gagal login. Lengkapi data!",
      })
      .code(400);
  }

  try {
    const userSnapshot = await db.collection("USER").where("email", "==", email).where("password", "==", password).get();

    if (userSnapshot.empty) {
      return h
        .response({
          status: "fail",
          message: "Email atau password salah",
        })
        .code(401);
    }

    const user = userSnapshot.docs[0].data();

    return h
      .response({
        status: "success",
        message: "Login berhasil",
        data: { user },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan saat login",
        error: error.message,
      })
      .code(500);
  }
};

const addTransaksiHandler = async (request, h) => {
  const { user_id, namalengkap, deskripsi, tanggal, alamat, metodePembayaran, total } = request.payload;

  if (!user_id || !namalengkap || !deskripsi || !tanggal || !alamat || !metodePembayaran || !total) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan transaksi. Lengkapi data!",
      })
      .code(400);
  }

  const id_transaksi = nanoid(10);
  const transaksi = { id_transaksi, user_id, namalengkap, deskripsi, tanggal, alamat, metodePembayaran, total, createdAt: new Date().toISOString() };

  try {
    await db.collection("TRANSAKSI").doc(id_transaksi).set(transaksi);

    return h
      .response({
        status: "success",
        message: "Transaksi berhasil ditambahkan",
        data: { transaksi },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Gagal menyimpan transaksi ke database",
        error: error.message,
      })
      .code(500);
  }
};

const getTransaksiHandler = async (request, h) => {
  const { id_transaksi } = request.params;

  try {
    const transaksiDoc = await db.collection("TRANSAKSI").doc(id_transaksi).get();

    if (!transaksiDoc.exists) {
      return h
        .response({
          status: "fail",
          message: "Transaksi tidak ditemukan",
        })
        .code(404);
    }

    const transaksi = transaksiDoc.data();

    return h
      .response({
        status: "success",
        data: transaksi,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan saat mengambil transaksi",
        error: error.message,
      })
      .code(500);
  }
};

const getRiwayatHandler = async (request, h) => {
  const { user_id } = request.params;

  try {
    const transaksiSnapshot = await db.collection("TRANSAKSI").where("user_id", "==", user_id).get();

    if (transaksiSnapshot.empty) {
      return h
        .response({
          status: "fail",
          message: "Riwayat transaksi tidak ditemukan",
        })
        .code(404);
    }

    const riwayatTransaksi = transaksiSnapshot.docs.map((doc) => doc.data());

    return h
      .response({
        status: "success",
        data: riwayatTransaksi,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan saat mengambil riwayat transaksi",
        error: error.message,
      })
      .code(500);
  }
};

module.exports = { registerHandler, addTukang, getAlluser, getAllTukang, getDataBeranda, getDetailProfile, searchHandler, loginHandler, addTransaksiHandler, getTransaksiHandler, getRiwayatHandler };
