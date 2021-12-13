module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "1337",
        gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
        gasPrice: 20000000000
      }
    }
  };