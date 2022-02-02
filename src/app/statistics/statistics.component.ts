import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    today: Date = new Date();

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ 15, 29, 30, 41, 56, 15, 10 ],
        label: 'Зарегистрированные',
        borderColor: '#28a745',
        backgroundColor: '#28a745',
        fill: 'origin',
      },
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Общий',
        backgroundColor: '#fd7e14',
        borderColor: '#fd7e14',
        fill: 'origin',
      },
    ],
  }

  public lineChartOptions: ChartConfiguration['options'] = {
   elements: {
     line: {
       tension: 0.5
     },
     point: {
       radius: 3
     }
   },
   scales: {
     x: {
       type: 'time',
       time: {
         // Luxon format string
         tooltipFormat: 'DD T'
       },
       // ticks: { color: '#ffffff90' },
     },
     y: {
         ticks: { color: '#ffffff90' },
         position: 'left',
       },
   },
 };
 public lineChartType: ChartType = 'line';

  constructor() {
    console.log(this.lineChartData.labels);
  }

  ngOnInit(): void {
  }

}
