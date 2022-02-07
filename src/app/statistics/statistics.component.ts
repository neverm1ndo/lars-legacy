import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../api.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  today: Date = new Date();
  stats: any = {};
  statTypes = ['Год', 'Месяц', 'Неделя', 'День'];
  range: any = '';

  changeStatsRange() {}

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
   elements: {
     line: {
       tension: 0.3
     },
     point: {
       radius: 3
     }
   },
   scales: {
     x: {
       ticks: {
         color: '#ffffff90',
       }
     },
     y: {
         ticks: {
           color: '#ffffff90',
           stepSize: 1,
           callback: function (value) { if (Number.isInteger(value)) { return value; } },
         },
         position: 'left',
       },
   },
 };
 public lineChartType: ChartType = 'line';

  constructor(private api: ApiService) {
    console.log(this.lineChartData.labels);
  }

  formLabel(date: Date): string {
    function convert(str: number): string {
      const pad = '00';
      return pad.substring(0, pad.length - str.toString().length) + str.toString();
    }
    const unformatted: {[prop: string]: number } = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
    return `${convert(unformatted.hours)}:${convert(unformatted.minutes)}:${convert(unformatted.seconds)}`
  }

  ngOnInit(): void {
    combineLatest([this.api.getStatsOnline(), this.api.getStatsChat()])
    .subscribe(([online, stats]) => {
      console.log(online, stats)
      this.lineChartData.datasets.push({
        data: online.data,
        label: 'Онлайн',
        backgroundColor: '#ff0000',
        borderColor: '#ff0000',
        fill: 'origin'
      });
      this.lineChartData.labels = online.labels
        .map((label: string) => new Date(label))
        .map((label: Date) => this.formLabel(label));
      this.stats['chat'] = stats;
    })
  }

}
