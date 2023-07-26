import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ChartHandler from "./ChartHandler";
import StockList from "./StockList";
import StockTable from "./stockTable";

export const Home = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStockList] = useState([]);
  const [show, setShow] = useState(false);
  const [stockData, setStockData] = useState();
  const [tableLoad, setTableLoad] = useState(false);
  const [stockSocket, setStockSocket] = useState(null);

  const handleSearch = async (selectedData) => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      setShow(false);
      setTableLoad(true);
      const payload = {
        stock_name: selectedData,
      };
      setSelectedStockList(selectedData);
      const temp_list = await axios.post(
        "http://localhost:8001/stock/get_selected_stock/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );
      setStockData(temp_list.data);
      setTableLoad(false);
      setShow(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          setLoading(true);
          const { data } = await axios.get("http://localhost:8001/home/", {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setMessage(data.message);
          setLoading(false);
        } catch (e) {
          console.log("not auth");
        }
      })();
    }
  }, []);

  useEffect(() => {
    const roomName = "track";
    const queryString = selectedStock;
    const stockSocket = new WebSocket(
      "ws://" +
        "127.0.0.1:8001" +
        "/ws/stock/track/" + "?" 

    );
    stockSocket.onopen = () => {
      console.log("WebSocket connected", stockSocket);
    };

    stockSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStockData(data)
      console.log("Received WebSocket message:", data);
    };

    stockSocket.onclose = () => {
      console.log("WebSocket closed");
    };

    setStockSocket(stockSocket)
    return () => {
      stockSocket.close();
    };
  }, []);

  const handleSelectedStockChange = (newSelectedStock) => {
    if (stockSocket && stockSocket.readyState === WebSocket.OPEN) {
      stockSocket.send(JSON.stringify({"stockpicker": newSelectedStock}));
    }
  };

  useEffect(() =>{
    handleSelectedStockChange(selectedStock)
  },[selectedStock])
  

  return (
    <div
      className="form-signin mt-5 text-center"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Loader
          style={{
            height: "20px",
            width: "20px",
          }}
          color="black"
        />
      ) : (
        <>
          <h3>Hi {message}</h3>
          <StockList handleSearch={handleSearch} />
          {tableLoad ? (
            <Loader
              style={{
                height: "40px",
                width: "40px",
                margin: "20px",
              }}
              color="blue"
            />
          ) : (
            <></>
          )}
          {show ? (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "30px",
              }}
            >
              Selected Stocks Data
            </p>
          ) : (
            <></>
          )}
          <div
            style={{
              overflow: "scroll",
              maxWidth: "1000px",
              margin: "30px",
            }}
          >
            <div
              style={{
                width: "3000px",
              }}
            >
              {show ? (
                <StockTable isLoading={tableLoad} review_history={stockData} />
              ) : (
                <></>
              )}
            </div>
          </div>
          {show ? <ChartHandler stock_data={stockData} /> : <></>}
        </>
      )}
    </div>
  );
};
