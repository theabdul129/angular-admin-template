import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const chartData = [
  {
    title: "Product Trends by months",
    chartSeries: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    x_axis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
  },
  {
    title: "Product Trends by Years",
    chartSeries: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    x_axis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
  },
];
@Injectable({
  providedIn: "root",
})
export class DashboardsService {
  constructor(private http: HttpClient) {}

  getAllDashboards(){
    return this.http.get(environment.analyticsUrl + '/dashboards/');
  }

  createDashboards(payload){
    return this.http.post(environment.analyticsUrl + '/dashboards/', payload,  {
      observe: "response"
    });
  }

  getUsefulTasks() {
    return this.http.get(environment.analyticsUrl + "/tasks/");
  }


  chartData: BehaviorSubject<any> = new BehaviorSubject(chartData);

  dashboardCards: BehaviorSubject<any> = new BehaviorSubject([
    {
      name: "60 day days",
      description: "Track new leads over the next 60 days",
      id: "1",
    },
    {
      name: "Part Exchanges",
      description: "Discover opportunities to back to back across the group",
      id: "2",
    },
    {
      name: "Cross sell",
      description: "Who can we cross sell to when they visit the dealer",
      id: "3",
    },
  ]);

  goalIdeas: BehaviorSubject<any> = new BehaviorSubject([
    {
      id: "f65d517a-6f69-4c88-81f5-416f47405ce1",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Discover: Can you find customers who would like to buy in the next 60 days",
      answer: "Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa.\n\nSit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.",
    },
    {
      id: "0fcece82-1691-4b98-a9b9-b63218f9deef",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Discover: Can you give me a solution for increasing sales",
      answer: "Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est.\n\nAute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.",
    },
    {
      id: "2e6971cd-49d5-49f1-8cbd-fba5c71e6062",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Discover: We have extra cars this month, do you have any solutions for increasing sales",
      answer: "Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa.\n\nCulpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.",
    },

    {
      id: "f65d517a-6f69-4c88-81f5-416f47405ce1",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Retain: Which customers should I use my incentives on",
      answer: "Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa.\n\nSit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.",
    },
    {
      id: "0fcece82-1691-4b98-a9b9-b63218f9deef",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Retain: Have you found any cross sell opportunities",
      answer: "Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est.\n\nAute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.",
    },
    {
      id: "2e6971cd-49d5-49f1-8cbd-fba5c71e6062",
      categoryId: "28924eab-97cc-465a-ba21-f232bb95843f",
      question: "Retain: I'm creating a marketing campaign for dependants buying their first car. Can you help?",
      answer: "Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa.\n\nCulpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.",
    },
  ]);
}
