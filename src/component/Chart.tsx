import React, {useRef} from 'react';
import '../normalize.css';
import '../dist.css';
import {ChartProps} from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  ChartOptions,
  defaults
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {saveAs} from 'file-saver';

//グラフで使用するモジュールの登録, グラフのデフォルトのフォントを設定
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, SubTitle, Tooltip, Legend);
defaults.color = '#333';
defaults.font.family =
  "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif";

const Chart: React.FC<ChartProps> = ({result, chartTitle, chartSubTitle}) => {
  // 折れ線グラフ関連
  const data = {
    labels: result.map((data) => data.np),
    datasets: [
      {
        label: '出現期待値',
        data: result.map((data) => data.ev),
        borderColor: '#fb6e53',
        backgroundColor: '#fb6e53',
        pointRadius: 0,
        borderWidth: 1.5,
        fill: false
      },
      {
        label: '1体以上出現確率',
        data: result.map((data) => data.leastOne),
        borderColor: '#489FFF',
        backgroundColor: '#489FFF',
        pointRadius: 0,
        borderWidth: 1,
        fill: false
      },
      {
        label: '出現期待値95%信頼区間上限',
        data: result.map((data) => data.evUp),
        borderColor: '#fb6e53',
        backgroundColor: '#fb6e53',
        pointRadius: 0,
        borderWidth: 0.5,
        fill: false
      },
      {
        label: '出現期待値95%信頼区間下限',
        data: result.map((data) => data.evLow),
        borderColor: '#fb6e53',
        backgroundColor: '#fb6e53',
        pointRadius: 0,
        borderWidth: 0.5,
        fill: false
      }
    ]
  };
  const options: ChartOptions<'line'> = {
    responsive: true, //responsiveがtrueだと縦横幅の設定がよく分からない
    animation: {
      duration: 0, // アニメーションの時間を0に設定することでアニメーションを無効にする
      easing: 'linear'
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          boxHeight: 1,
          font: {
            size: 12.5
          }
        }
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 16
        },
        padding: {
          top: 0,
          bottom: 5
        }
      },
      subtitle: {
        display: true,
        text: chartSubTitle, // 試行回数,ねむけパワー間隔,作成者
        font: {
          size: 12
        },
        padding: {
          top: 0,
          bottom: 8
        }
      }
    },
    scales: {
      x: {
        min: 0,
        // max: limitNP,
        ticks: {
          // 	callback: (value: number) => {
          // 		// result.np と一致する値を必ず取得（見つかる前提）
          // 		const target= result.find((data) => data.np === value);

          // 		// limitNP を使って条件に一致する場合だけ np を返す
          // 		for (let j = 0; j <= 2; j++) {
          // 				if (target.np === (limitNP * j) / 2) {
          // 						return target.np; // 対応する np を返す
          // 				}
          // 		}

          // 		条件に一致しない場合の戻り値（理論上ここに到達しない前提）
          // 		return null;
          // },
          padding: 0, // ラベルの余白
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'ねむけパワー',
          font: {
            size: 14
          },
          padding: {
            top: 0,
            bottom: 0
          }
        }
      },
      y: {
        min: 0,
        ticks: {
          padding: 0,
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: '出現期待値, 1体以上出現確率',
          font: {
            size: 13
          },
          padding: {
            top: 5,
            bottom: 5
          }
        }
      }
    }
  };
  const chartRef = useRef<ChartJS | null>(null);
  const saveChartAsImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const canvas = chart.canvas as HTMLCanvasElement;
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, 'chart.png');
        } else {
          console.error('Failed to generate image blob');
        }
      }, 'image/png'); // MIME タイプを明示的に指定
    } else {
      console.error('Chart is not available');
    }
  };

  return (
    <div className="Chart">
      <div className="chart">
        <Line ref={chartRef as any} width="100%" height={450} data={data} options={options} />
      </div>
      <button
        onClick={saveChartAsImage}
        className="flex justify-center buttonShadow font-bold text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 my-2 mx-auto w-40"
      >
        画像保存する
      </button>
    </div>
  );
};

export default Chart;
