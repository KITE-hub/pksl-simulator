import React, {useMemo} from 'react';
import {ResponsiveContainer, LineChart, Legend, Tooltip, Line, CartesianGrid, XAxis, YAxis, Text} from 'recharts';
import {ChartProps} from '../types';
import '../App.css';

const ChartWide: React.FC<ChartProps> = ({result, chartTitle1, chartTitle2, chartSubTitle}) => {
  const minX = Math.min(...result.map((d) => d.np));
  const maxX = Math.max(...result.map((d) => d.np));
  const ticksX = Array.from({length: 11}, (_, index) => minX + (maxX - minX) * (index / 10));

  const maxExpCandy = Math.ceil(Math.max(...result.map((d) => d.expCandy)));
  const ticksExpCandy = Array.from({length: 5}, (_, index) => (maxExpCandy - 0) * (index / 4));

  return (
    <div className="ChartWide">
      <div className="chart1">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={result} margin={{top: 65, right: 25, left: 5, bottom: 5}}>
            <text y={5} fill="#333" textAnchor="middle" fontSize={16} fontWeight="bold">
              <tspan x="50%" dy="1.2em">
                {chartTitle1[0]} <tspan fontSize="12">{chartTitle1[1]}</tspan> {chartTitle1[2]}
              </tspan>
              <tspan x="50%" dy="1.2em">
                {chartTitle1[3]}
              </tspan>
            </text>
            <text x="50%" y={60} textAnchor="middle" fontSize={11} fill="#888">
              {chartSubTitle}
            </text>
            <Legend
              verticalAlign="top"
              dy={10}
              wrapperStyle={{
                fontSize: '11px',
                paddingBottom: '5px'
              }}
            />
            <CartesianGrid stroke="#ccc" strokeWidth={0.5} />
            <Tooltip
              wrapperStyle={{
                fontSize: '12px'
              }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #25d76b',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                lineHeight: '0.9',
                boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.1)'
              }}
            />
            <XAxis
              style={{fontSize: '11px'}}
              type="number"
              dataKey="np"
              key={JSON.stringify(ticksX)}
              ticks={ticksX}
              tickLine={true}
              tickSize={15}
              interval={0}
              dy={10}
              height={80}
              label={{value: 'ねむけパワー', dy: 35, height: 30, fontSize: 14}}
              angle={45}
              domain={['auto', 'auto']}
            />
            <YAxis
              style={{fontSize: '12px'}}
              type="number"
              dataKey="ev"
              label={{
                value: '出現期待値, 1体以上出現確率',
                fontSize: 14,
                angle: -90,
                textAnchor: 'middle',
                dx: -20
              }}
            />
            <Line type="monotone" dataKey="ev" name="出現期待値" stroke="#fb6e53" dot={false} strokeWidth={1.5} />
            <Line
              type="monotone"
              dataKey="leastOne"
              name="1体以上出現確率"
              stroke="#489FFF"
              dot={false}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="evUp"
              name="出現期待値95%信頼区間(+)"
              stroke="#fb6e53"
              dot={false}
              strokeWidth={0.25}
            />
            <Line
              type="monotone"
              dataKey="evLow"
              name="出現期待値95%信頼区間(-)"
              stroke="#fb6e53"
              dot={false}
              strokeWidth={0.25}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart2">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={result} margin={{top: 65, right: 5, left: 5, bottom: 5}}>
            <text y={5} fill="#333" textAnchor="middle" fontSize={16} fontWeight="bold">
              <tspan x="50%" dy="1.2em">
                {chartTitle1[0]} <tspan fontSize="12">{chartTitle1[1]}</tspan> {chartTitle1[2]}
              </tspan>
              <tspan x="50%" dy="1.2em">
                {chartTitle1[3]}
              </tspan>
            </text>
            <text x="50%" y={60} textAnchor="middle" fontSize={11} fill="#888">
              {chartSubTitle}
            </text>
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                fontSize: '11px',
                paddingBottom: '5px'
              }}
            />
            <CartesianGrid stroke="#ccc" strokeWidth={0.5} />
            <Tooltip
              wrapperStyle={{
                fontSize: '12px'
              }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #25d76b',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                lineHeight: '0.9',
                boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.1)'
              }}
            />
            <XAxis
              style={{fontSize: '11px'}}
              type="number"
              dataKey="np"
              key={JSON.stringify(ticksX)}
              ticks={ticksX}
              tickLine={true}
              tickSize={15}
              interval={0}
              dy={10}
              height={80}
              label={{value: 'ねむけパワー', dy: 35, height: 30, fontSize: 14}}
              angle={45}
              domain={['auto', 'auto']}
            />
            <YAxis
              style={{fontSize: '12px'}}
              type="number"
              dataKey="dreamShard"
              tickCount={5}
              label={{
                value: 'リサーチEXP, ゆめのかけら',
                fontSize: 14,
                angle: -90,
                textAnchor: 'middle',
                dx: -25
              }}
            />
            <YAxis
              style={{fontSize: '12px'}}
              yAxisId="right"
              orientation="right"
              type="number"
              dataKey="expCandy"
              key={JSON.stringify(ticksExpCandy)}
              domain={[0, maxExpCandy]}
              ticks={ticksExpCandy}
              label={{
                value: 'アメの個数 (個)',
                fontSize: 14,
                angle: -90,
                textAnchor: 'middle',
                dx: 20
              }}
            />
            <Line
              type="monotone"
              yAxisId="right"
              dataKey="expCandy"
              name="アメの個数"
              stroke="#25d76b"
              dot={false}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="dreamShard"
              name="ゆめのかけら"
              stroke="#f6b84b"
              dot={false}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="researchExp"
              name="リサーチEXP"
              stroke="#489FFF"
              dot={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWide;
