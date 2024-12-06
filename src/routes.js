const {
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
  rekomendtukang,
  getTukangByLokasiHandler,
} = require("./handler");

routes = [
  {
    method: "POST",
    path: "/register",
    handler: registerHandler,
  },
  {
    method: "GET",
    path: "/register",
    handler: getAlluser,
  },
  {
    method: "POST",
    path: "/tukang",
    handler: addTukang,
  },
  {
    method: "GET",
    path: "/tukang",
    handler: getAllTukang,
  },
  {
    method: "GET",
    path: "/tukang/{users_id}",
    handler: getDataBeranda,
  },
{
    method: "POST",
    path: "/tukang/{tukang_id}",
    handler: updateTukang,
},
  {
    method: "GET",
    path: "/detailprofile/{user_id}",
    handler: getDetailProfile,
  },
  {
    method: "GET",
    path: "/search",
    handler: searchHandler,
  },
  { 
    method: "POST", 
    path: "/users/login", 
    handler: loginHandler,
  },
  { method: 'POST', 
    path: '/addtransaksi', 
    handler: addTransaksiHandler,
  },
  { method: 'GET', 
    path: '/transaksi/{id_transaksi}', 
    handler: getTransaksiHandler,
  },
  { method: 'GET', 
    path: '/riwayat/{user_id}', 
    handler: getRiwayatHandler, 
  },
  {
    method: "GET",
    path: "/",
    handler: () => "Ini adalah halaman utama",
  },
  {
    method: "GET",
    path: "/detailtukang/{tukang_id}",
    handler: getDetailTukang,
  },
  {
    method: "GET",
    path: "/detailtransaksi/{id_transaksi}",
    handler: getDetailTransaksi
  },
  {
    method: "GET",
    path: "/tukangbylokasi",
    handler: getTukangByLokasiHandler,
  }
  // {
  //   method: "POST",
  //   path: "/rectukang",
  //   handler: rekomendtukang,

  // }
];

module.exports = routes;


// duplikat file

// Path: src/routes.js