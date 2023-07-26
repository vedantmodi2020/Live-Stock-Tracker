import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData,chartName }) {
  return (
    <div className="chart-container" style={{
      margin:'10px'
    }}>
      <h2 style={{ textAlign: "center" }}>{chartName}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "total volume data"
            }
          }
        }}
      />
    </div>
  );
}
export default PieChart;