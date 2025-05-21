import { Pie } from "react-chartjs-2";
import Loader from "../../Loader/Loader";



const SubjectPieChart = ({labels,pieData}) => {
  // console.log("monthlyTotals",pieData)
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Subjects",
        data: pieData,
        backgroundColor: [
          "#0C829B",
          "#6986F5",
          "#F39C12",
          "#E74C3C",
          "#D35400",
          "#F1C40F",
          "#8852EE",
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

  // if (!labels || !pieData){
  //   return(
  //     <Loader />
  //   )
  // }
  return (
    <div className="flex items-start lg:gap-6">
      {/* Chart */}
      <div className="lg:h-[310px]">
        <Pie data={data} options={options} />
      </div>

      {/* Custom Legend */}
      <div className="bg-white px-4 w-[180px] py-2 rounded-lg text-sm space-y-1 lg:mt-16">
        {legendData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block !w-[12px] !h-[12px] rounded-full"
              style={{ backgroundColor: item.color as string }}
            ></span>
            <span className="text-gray-700 font-medium">{item.label.split(" ").slice(0, 2).join(" ")}...</span>
            {/* <span className="text-blue-600 font-semibold ml-auto">
              {item.value}
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPieChart;
