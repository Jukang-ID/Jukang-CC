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
    path: "/tukang/{user_id}",
    handler: getDataBeranda,
  },
{
    method: "POST",
    path: "/tukang/{user_id}",
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
  }
];

module.exports = routes;
