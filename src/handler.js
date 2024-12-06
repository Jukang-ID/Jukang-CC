const { nanoid } = require("nanoid");
const db = require("./firebase");
const { messaging } = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const loadModel = require("./services/loadmodel");
const tf = require("@tensorflow/tfjs-node");

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
  const tukang_id = uuidv4();
  const photoNumber = Math.floor(Math.random() * 70) + 1;
  const photoUrl = `https://i.pravatar.cc/300?img=${photoNumber}`;
  const price = Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;

  const cities = [
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Utara",
    "Jakarta Barat",
    "Bogor",
    "Depok",
    "Tangerang",
    "Bekasi",
  ];
  const priceRupiah = price.toLocaleString("id-ID", {
    currency: "IDR",
    style: "currency",
  });

  const { namatukang, spesialis, review = 0, booked = false } = request.payload;

  const randomcities = cities[Math.floor(Math.random() * cities.length)];

  // Set `reviewCount` ke 1 jika review diberikan saat penambahan, atau 0 jika belum ada review.
  const reviewCount = review > 0 ? 1 : 0;
  const totalReviewRating = review;

  const newtukang = {
    tukang_id,
    namatukang,
    spesialis,
    review,
    reviewCount,
    totalReviewRating,
    booked,
    photoUrl,
    priceRupiah,
    randomcities,
  };

  if (!namatukang || !spesialis) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan tukang. Lengkapi data!",
      })
      .code(400);
  }

  try {
    await db.collection("TUKANG").doc(tukang_id).set(newtukang);
    return h
      .response({
        status: "success",
        message: "Tukang berhasil ditambahkan",
        tukang: newtukang,
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

const updateTukang = async (request, h) => {
  const { tukang_id } = request.params;
  const { namatukang, spesialis, review, booked } = request.payload;

  const cities = [
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Utara",
    "Jakarta Barat",
    "Bogor",
    "Depok",
    "Tangerang",
    "Bekasi",
  ];

  if (!tukang_id) {
    return h
      .response({
        status: "fail",
        message: "Tukang ID tidak ditemukan",
      })
      .code(400);
  }

  try {
    const tukangRef = db.collection("TUKANG").doc(tukang_id);
    const tukangDoc = await tukangRef.get();

    if (!tukangDoc.exists) {
      return h
        .response({
          status: "fail",
          message: "Data tukang tidak ditemukan",
        })
        .code(404);
    }

    const tukangData = tukangDoc.data();

    const currentReviewCount = tukangData.reviewCount || 0;
    const currentTotalReviewRating =
      parseFloat(tukangData.totalReviewRating) || 0;
    const newReview = parseFloat(review);

    // Perbarui `totalReviewRating` dan `reviewCount`
    const updatedReviewCount = currentReviewCount + 1;
    const updatedTotalReviewRating = currentTotalReviewRating + newReview;
    const averageReview = (
      updatedTotalReviewRating / updatedReviewCount
    ).toFixed(1);

    const randomcities = cities[Math.floor(Math.random() * cities.length)];

    // Data yang akan diperbarui
    const updatedtukang = {
      namatukang: namatukang || tukangData.namatukang,
      spesialis: spesialis || tukangData.spesialis,
      review: averageReview, // Rata-rata baru
      reviewCount: updatedReviewCount, // Jumlah review diperbarui
      totalReviewRating: updatedTotalReviewRating, // Total rating diperbarui
      booked: booked !== undefined ? booked : tukangData.booked,
      domisili: tukangData.domisili || randomcities,
    };

    await tukangRef.update(updatedtukang);

    return h
      .response({
        status: "success",
        message: "Tukang berhasil diperbarui",
        tukang: updatedtukang,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Tukang gagal diperbarui",
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
        tukang: tukangs,
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

    const tukangSnapshot = await db
      .collection("TUKANG")
      .where("booked", "==", false)
      .get();
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
    const userSnapshot = await db
      .collection("USER")
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

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
  const {
    user_id,
    namalengkap,
    namatukang,
    tukang_id,
    spesialis,
    deskripsi,
    tanggal,
    alamat,
    metodePembayaran,
    total,
  } = request.payload;

  if (
    !user_id ||
    !namalengkap ||
    !deskripsi ||
    !tanggal ||
    !alamat ||
    !metodePembayaran ||
    !total
  ) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan transaksi. Lengkapi data!",
      })
      .code(400);
  }

  const id_transaksi = nanoid(10);
  const transaksi = {
    id_transaksi,
    user_id,
    namalengkap,
    namatukang,
    tukang_id,
    spesialis,
    deskripsi,
    tanggal,
    alamat,
    metodePembayaran,
    total,
    createdAt: new Date().toISOString(),
  };

  try {
    // Cek apakah tukang sudah dibooking
    const tukangDoc = await db.collection("TUKANG").doc(tukang_id).get();

    if (!tukangDoc.exists) {
      return h
        .response({
          status: "fail",
          message: "Tukang tidak ditemukan",
        })
        .code(404);
    }

    const tukangData = tukangDoc.data();

    if (tukangData.booked === true) {
      return h
        .response({
          status: "fail",
          message:
            "Tukang sudah dibooking, tidak dapat melakukan pemesanan lagi.",
        })
        .code(400);
    }

    // Jika tukang belum dibooking, lanjutkan transaksi
    await db.collection("TRANSAKSI").doc(id_transaksi).set(transaksi);

    // Update status `booked` tukang menjadi `true`
    await db.collection("TUKANG").doc(tukang_id).update({
      booked: true,
    });

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
    const transaksiDoc = await db
      .collection("TRANSAKSI")
      .doc(id_transaksi)
      .get();

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
    const transaksiSnapshot = await db
      .collection("TRANSAKSI")
      .where("user_id", "==", user_id)
      .get();

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

const getDetailTukang = async (request, h) => {
  const { tukang_id } = request.params;

  try {
    const tukangSnapshot = await db.collection("TUKANG").doc(tukang_id).get();
    if (!tukangSnapshot.exists) {
      const response = h.response({
        status: "fail",
        message: "Tukang tidak ditemukan",
      });
      response.code(404);
      return response;
    }
    const tukangs = tukangSnapshot.data();
    const response = h.response({
      status: "success",
      detailTukang: tukangs,
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

const getDetailTransaksi = async (request, h) => {
  const { id_transaksi } = request.params;

  let IsRating = false;
  try {
    const transaksiSnapshot = await db
      .collection("TRANSAKSI")
      .where("id_transaksi", "==", id_transaksi)
      .get();

    if (transaksiSnapshot.empty) {
      return h
        .response({
          status: "fail",
          message: "Transaksi tidak ditemukan",
        })
        .code(404);
    }

    const riwayatresult = transaksiSnapshot.docs.map((doc) => doc.data());

    return h.response({
      status: "success",
      detailtransaksi: riwayatresult,
    });
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan saat mengambil riwayat transaksi",
        error: error.message,
      })
      .code(404);
  }
};

const getTukangByLokasiHandler = async (request, h) => {
  try {
    const { domisili } = request.params;
    
    const tukangSnapshot = await db.collection("TUKANG").where("domisili", "==", domisili).get();

    if (tukangSnapshot.empty){
      const allSnapshot = await db.collection("TUKANG").get();
      const allTukang = [];
      allSnapshot.forEach(doc => {
        allTukang.push({ id: doc.id, ...doc.data() });
      });

      return h.response ({
        status: "success",
        allTukang
      }).code(200);
    }

    const tukangList = [];
    tukangSnapshot.forEach((doc) => {
      tukangList.push({ id: doc.id, ...doc.data() });
    });

    return h.response({
      status: "success",
      message: `Berhasil mendapatkan tukang di domisili: ${domisili}`,
      data: tukangList,
    }).code(200);

  } catch (error) {
    return h.response({
      status: "error",
      message: error.message,
    }).code(500);
  }
}

// const rekomendtukang = async (request, h) => {
//   const { jarak, lokasi, rating,  } = request.payload;
//   try {
//     const model = await tf.loadLayersModel(
//       "https://storage.googleapis.com/model-jukangid/model-in-prod/model.json"
//     );

//     const tukangData = await getAllTukang();
//     const inputData = tukangData.map((tukang) => [
//       tukang.review || 0, // Default 0 jika tidak ada
//       tukang.reviewCount || 0, // Default 0 jika tidak ada
//       jarak,
//       lokasi === "Jabodetabek" ? 1 : 0, // Binary encoding untuk lokasi
//     ]);
//     const tensorInput = tf.tensor2d(inputData);
//     const predictions = model.predict(tensorInput).arraySync();

//     const hasilRekomendasi = tukangData.map((tukang, index) => ({
//       ...tukang,
//       skorRekomendasi: predictions[index][0],
//     }));
//     hasilRekomendasi.sort((a, b) => b.skorRekomendasi - a.skorRekomendasi);

//     return h.response({ rekomendasi: hasilRekomendasi }).code(200);
//   } catch (error) {
//     console.error('Error dalam rekomendasi:', error);
//     return h.response({ error: 'Gagal melakukan rekomendasi' }).code(500);
//   }
// };

module.exports = {
  registerHandler,
  addTukang,
  getAlluser,
  getAllTukang,
  getDataBeranda,
  getDetailProfile,
  searchHandler,
  loginHandler,
  addTransaksiHandler,
  getTransaksiHandler,
  getRiwayatHandler,
  updateTukang,
  getDetailTukang,
  getDetailTransaksi,
  getTukangByLokasiHandler
  // rekomendtukang,
};

// push api

// payment
