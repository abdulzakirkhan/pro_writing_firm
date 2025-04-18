import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SubjectPieChart = () => {
  const data = {
    labels: [
      "OOP",
      "Data Structures",
      "Business",
      "English",
      "Essay Writing",
      "Calculus",
    ],
    datasets: [
      {
        label: "Subjects",
        data: [57, 23, 10, 5, 4, 1],
        backgroundColor: [
          "#0C829B", // OOP
          "#27AE60", // Data Structures
          "#F39C12", // Business
          "#E74C3C", // English
          "#D35400", // Essay Writing
          "#F1C40F", // Calculus
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // we'll create a custom legend
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const legendData = data.labels.map((label, index) => ({
    label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor[index],
  }));

  return (
    <div className="flex flex-wrap items-start lg:gap-6">
      {/* Chart */}
      <div className="lg:h-[310px]">
        <Pie data={data} options={options} />
      </div>

      {/* Custom Legend */}
      <div className="bg-white px-4 w-[259px] py-2 rounded-lg text-sm space-y-1 lg:mt-16">
        {legendData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color as string }}
            ></span>
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-blue-600 font-semibold ml-auto">
              ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPieChart;
