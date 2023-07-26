import React, { useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Loader from "./Loader";
import axios from "axios";

const StockTypes = [
  "Nifty 50",
  "Dow Jones Industrial Average",
  "Nasdaq 100",
  "Nifty Bank",
];

const StockList = ({ handleSearch = () => {} }) => {
  const [selectedStock, setSelectedStock] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [selectStock, setSelectStock] = useState();
  const [loading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [data, setData] = useState([]);

  const handleListItemClick = (stockName) => {
    if (selectedStock.includes(stockName)) {
      setSelectedStock((prevSelectedStock) =>
        prevSelectedStock.filter((stock) => stock !== stockName)
      );
    } else {
      setSelectedStock((prevSelectedStock) => [
        ...prevSelectedStock,
        stockName,
      ]);
    }
  };

  const handleSubmitCall = () => {
    handleSearch(selectedStock);
  };

  const handleStockChange = async (event) => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      setIsSelect(true);
      setLoading(true);
      setSelectStock(event.target.value);
      const payload = {
        stock_type: event.target.value,
      };

      const temp_list = await axios.post(
        "http://localhost:8001/stock/get_stocks/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );
      console.log(temp_list);
      setData(temp_list.data);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <FormControl fullWidth variant="outlined">
        <InputLabel id="stock-select-label">Select the Stock Type</InputLabel>
        <Select
          labelId="stock-select-label"
          id="stock-select"
          value={selectStock}
          onChange={handleStockChange}
          label="Select Stock"
          variant="outlined"
          style={{
            width: 600,
            height: 70,
            marginBottom: 20,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          {StockTypes.map((stock, index) => (
            <MenuItem key={index} value={stock}>
              {stock}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <Loader
          style={{
            height: "20px",
            width: "20px",
          }}
          color="black"
        />
      ) : isSelect ? (
        <>
          <div
            style={{
              border: "1px solid black",
              borderRadius: "15px",
              maxHeight: "400px",
              width: "600px",
              overflow: "scroll",
            }}
          >
            <List component="nav" aria-label="Stock List">
              {data
                ? data.map((item) => (
                    <ListItem
                      button
                      key={item}
                      style={{
                        width: "598px",
                        backgroundColor: selectedStock.includes(item)
                          ? "lightblue"
                          : "transparent",
                      }}
                      onClick={() => handleListItemClick(item)}
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))
                : null}
            </List>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitCall}
            style={{ height: 60, width: 300, marginTop: 20 }}
          >
            Submit
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StockList;
