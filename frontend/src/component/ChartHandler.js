import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import { BarChart } from "./BarChart";

Chart.register(CategoryScale);

const ChartHandler = ({ stock_data }) => {
  const filteredStockData = Object.fromEntries(
    Object.entries(stock_data).filter(([stockName, data]) => data !== null)
  );

  const stockNames = Object.keys(filteredStockData);

  const quotePrices = stockNames.map(
    (stockName) => filteredStockData[stockName]["Quote Price"]
  );

  const volumeData = stockNames.map(
    (stockName) => filteredStockData[stockName]["Volume"]
  );

  const EPSData = stockNames.map(
    (stockName) => filteredStockData[stockName]["EPS (TTM)"]
  );

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const backgroundColors = stockNames.map(() => generateRandomColor());

  const chartDataPrice = {
    labels: stockNames,
    datasets: [
      {
        label: "Quote Price",
        data: quotePrices,
        backgroundColor: backgroundColors,
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  const chartDataVolume = {
    labels: stockNames,
    datasets: [
      {
        label: "Volume",
        data: volumeData,
        backgroundColor: backgroundColors,
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  const chartDataEPS = {
    labels: stockNames,
    datasets: [
      {
        label: "EPS",
        data: EPSData,
        backgroundColor: backgroundColors,
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      {" "}
      <div
        className="App"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <LineChart
          chartData={chartDataPrice}
          chartName={"Live Price Comparision"}
        />
        <PieChart
          chartData={chartDataVolume}
          chartName={"Total Volumes Chart"}
        />
      </div>
      <BarChart
        chartData={chartDataEPS}
        chartName={"Earning Per  Share comparision"}
      />
    </>
  );
};

export default ChartHandler;
