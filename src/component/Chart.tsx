import React, {useRef} from 'react';
import 'normalize.css';
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
  defaults,
  Plugin
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {saveAs} from 'file-saver';
import html2canvas from 'html2canvas';

const backgroundColorPlugin: Plugin = {
  id: 'backgroundColorPlugin',
  beforeDraw: (chart) => {
    // 型を直接 'Chart' に設定
    const ctx = chart.ctx;
    if (ctx) {
      ctx.save();
      ctx.fillStyle = '#f1f5f9'; // 背景色を設定
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  }
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  backgroundColorPlugin
);
devicePixelRatio = 2;
defaults.color = '#333';
defaults.font.family =
  "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif";

const Chart: React.FC<ChartProps> = ({result, chartTitle1, chartTitle2, chartSubTitle}) => {
  // 折れ線グラフ関連
  const data1 = {
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
  const data2 = {
    labels: result.map((data) => data.np),
    datasets: [
      {
        label: 'アメの個数',
        data: result.map((data) => data.expCandy),
        borderColor: '#25d76b',
        backgroundColor: '#25d76b',
        pointRadius: 0,
        borderWidth: 1,
        fill: false,
        yAxisID: 'y2'
      },
      {
        label: 'リサーチEXP',
        data: result.map((data) => data.researchExp),
        borderColor: '#489FFF',
        backgroundColor: '#489FFF',
        pointRadius: 0,
        borderWidth: 1,
        fill: false,
        yAxisID: 'y1'
      },
      {
        label: 'ゆめのかけら',
        data: result.map((data) => data.dreamShard),
        borderColor: '#f6b84b',
        backgroundColor: '#f6b84b',
        pointRadius: 0,
        borderWidth: 1,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };
  const options1: ChartOptions<'line'> = {
    responsive: true, //responsiveがtrueだと縦横幅の設定がよく分からない
    animation: {
      duration: 0, // アニメーションの時間を0に設定することでアニメーションを無効にする
      easing: 'linear'
    },
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: chartTitle1,
        font: {
          size: 16
        },
        padding: {
          top: 15,
          bottom: 5
        }
      },
      subtitle: {
        display: true,
        text: chartSubTitle, // 試行回数,ねむけパワー間隔,作成者
        font: {
          size: 11
        },
        padding: {
          top: 0,
          bottom: 0
        }
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          boxHeight: 1,
          font: {
            size: 11
          }
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
            size: 10
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
            size: 11
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
  const options2: ChartOptions<'line'> = {
    responsive: true, //responsiveがtrueだと縦横幅の設定がよく分からない
    animation: {
      duration: 0, // アニメーションの時間を0に設定することでアニメーションを無効にする
      easing: 'linear'
    },
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: chartTitle2,
        font: {
          size: 16
        },
        padding: {
          top: 15,
          bottom: 5
        }
      },
      subtitle: {
        display: true,
        text: chartSubTitle, // 試行回数,ねむけパワー間隔,作成者
        font: {
          size: 11
        },
        padding: {
          top: 0,
          bottom: 0
        }
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          boxHeight: 1,
          font: {
            size: 11
          }
        }
      }
    },
    scales: {
      x: {
        min: 0,
        // max: limitNP,
        ticks: {
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
      y1: {
        min: 0,
        ticks: {
          padding: 0,
          color: '#966207',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'リサーチEXP, ゆめのかけら',
          color: '#966207',
          font: {
            size: 13
          },
          padding: {
            top: 5,
            bottom: 5
          }
        },
        grid: {
          color: '#E1CFB1' // 'hsl(38, 45%, 80%)'
        }
      },
      y2: {
        min: 0,
        position: 'right',
        ticks: {
          padding: 0,
          color: '#136C35',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'アメの個数 (個)',
          color: '#136C35',
          font: {
            size: 13
          },
          padding: {
            top: 5,
            bottom: 5
          }
        },
        grid: {
          color: '#B5E2C6' // 'hsl(143, 45%, 80%)'
        }
      }
    }
  };
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const saveChartsAsImage = async () => {
    if (chartContainerRef.current) {
      // HTML全体をキャプチャ
      const canvas = await html2canvas(chartContainerRef.current);

      // キャプチャしたcanvasを画像として保存
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, 'charts.png');
        } else {
          console.error('Failed to generate image blob');
        }
      }, 'image/png');
    } else {
      console.error('Chart container is not available');
    }
  };

  return (
    <div className="Chart">
      <div ref={chartContainerRef} className="chartsFlex">
        <div className="chart1">
          <Line width="100%" height={400} data={data1} options={options1} />
        </div>
        <div className="chart2">
          <Line width="100%" height={400} data={data2} options={options2} />
        </div>
      </div>
      <button
        onClick={saveChartsAsImage}
        className="flex justify-center buttonShadow font-bold text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 my-2 mx-auto w-40"
      >
        画像保存する
      </button>
    </div>
  );
};

export default Chart;
