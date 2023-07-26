import React from "react";
import { Line } from "react-chartjs-2";


function LineChart({ chartData,chartName }) {
  return (
    <div className="chart-container" style={{
      margin:'10px'
    }}>
      <h2 style={{ textAlign: "center" }}>{chartName}</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Current Stock Price"
            },
            legend: {
              display: false
            }
          }
        }}
        height={400}
        width={600}

      />
    </div>
  );
}
export default LineChart;