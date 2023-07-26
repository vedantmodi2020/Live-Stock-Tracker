import { Bar } from "react-chartjs-2";


export const BarChart = ({ chartData,chartName }) => {
  return (
    <div className="chart-container" style={{
        margin:'10px'
      }}>
      <h2 style={{ textAlign: "center" }}>{chartName}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "profit on every share bought"
            },
            legend: {
              display: false
            }
          }
        }}
        height={600}
        width={1000}
      />
    </div>
  );
};
