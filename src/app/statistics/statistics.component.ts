import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
// import { AppConfig } from '../../environments/environment';
import { ApiService } from '../api.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {


  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  today: Date = new Date();
  stats: any = {};
  statTypes = ['Год', 'Месяц', 'Неделя', 'День'];
  range: any = '';

  model: NgbDateStruct;

  fa = {
    calendar: faCalendar
  };

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
       radius: 0
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

  constructor(private api: ApiService) {};

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

  drawOnlineGraph(online: any) {
    this.lineChartData.datasets = [];
    this.lineChartData.datasets.push({
      data: online.data,
      label: 'Онлайн',
      backgroundColor: '#fd7e14',
      borderColor: '#fd7e14',
      pointBackgroundColor: "#fd7e14",
      fill: 'origin'
    });
    this.lineChartData.labels = online.labels
      .map((label: string) => new Date(label))
      .map((label: Date) => this.formLabel(label));
    this.chart.update();
  }

  dayStatDateSelect(day: NgbDate) {
    console.log(day)
    this.api.getStatsOnline(new Date(day.year, day.month - 1, day.day))
    .pipe(take(1))
    .subscribe((online) => {
      this.drawOnlineGraph(online);
    });
  }

  ngOnInit(): void {
    combineLatest([this.api.getStatsOnline(new Date()), this.api.getStatsChat()])
    .pipe(take(1))
    .subscribe(([online, stats]) => {
      this.stats['chat'] = stats;
      if (!online) return;
      this.drawOnlineGraph(online);
    });
  }

}
