import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from 'angular-calendar';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
import * as FileSaver from 'file-saver';
import { CatchmentAreaService } from '../../catchment/catchment.area.service';
import { MatSelect } from '@angular/material/select';
import { InventoryService } from '../../inventory/inventory.service';
import { ProductCategoryService } from '../../inventory/product-category/category.service';
import { StoreService } from '../../stores/store.service';

@Component({
    selector: 'app-productssales',
    templateUrl: './product-sales.component.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class ProductSalesComponent implements OnInit {

    orderReportOptions: ApexOptions;
    productChargeReportOptions: ApexOptions;
    deliveryReportOptions: ApexOptions;
    totalReportOptions: ApexOptions;
    orderReportData: any;
    errorMsg: any;
    startDate: any;
    endDate: any;
    reportPeriod = 'day';
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

    public catchmentCtrl: UntypedFormControl = new UntypedFormControl();
    public catchmentFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filtercatchments = new ReplaySubject(1);

    public productCtrl: UntypedFormControl = new UntypedFormControl();
    public productFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filterproducts = new ReplaySubject(1);

    public categoryCtrl: UntypedFormControl = new UntypedFormControl();
    public categoryFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filtercategory = new ReplaySubject(1);

    public storeCtrl: UntypedFormControl = new UntypedFormControl();
    public storeFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filterStores = new ReplaySubject(1);

    catchments: any;
    catchmentAreas: any;
    products: any;
    categories: any;
    stores: any;
    selectedProduct: any;
    selectedCategory: any;
    selectedStores: any;
    currency: any;

    constructor(
        private analyticsService: AnalyticsService,
        private catchmentService: CatchmentAreaService,
        private inventory: InventoryService,
        private categoryService: ProductCategoryService,
        private storeService: StoreService
    ) { }

    dateRange = new UntypedFormGroup({
        start: new UntypedFormControl(moment()),
        end: new UntypedFormControl(moment())
    });

    ngOnInit() {
        this.getOrderReport();
        this.getCatchments();
        this.getProducts();
        this.getCategories();
        this.getStores();
    }

    getCatchments() {
        this.isLoading.next(true);
        this.catchmentService.getAll(0, 500).subscribe((data: any) => {
            this.isLoading.next(false);
            this.catchments = data.data;
            this.filtercatchments.next(this.catchments.slice());
        });
        this.catchmentFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterData(this.catchments, this.filtercatchments, this.catchmentFilterCtrl.value);
            });
    }

    getProducts() {
        this.isLoading.next(true);
        this.inventory.getAll(0, 1500).subscribe((data: any) => {
            this.isLoading.next(false);
            this.products = data.data;
            this.filterproducts.next(this.products.slice());
        });
        this.productFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterData(this.products, this.filterproducts, this.productFilterCtrl.value);
            });
    }

    getCategories() {
        this.isLoading.next(true);
        this.categoryService.getAll(0, 500).subscribe((data: any) => {
            this.isLoading.next(false);
            this.categories = data.data;
            this.filtercategory.next(this.categories.slice());
        });
        this.categoryFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterData(this.categories, this.filtercategory, this.categoryFilterCtrl.value);
            });
    }

    getStores() {
        this.isLoading.next(true);
        this.storeService.getStores(0, 500).subscribe((data: any) => {
            this.isLoading.next(false);
            this.stores = data.data;
            this.filterStores.next(this.stores.slice());
        });
        this.storeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterData(this.stores, this.filterStores, this.storeFilterCtrl.value);
            });
    }

    _onDestroy = new Subject();

    filterData(data, filterData, searchVal) {
        if (!data) return;
        let search = searchVal;
        if (!search) {
            filterData.next(data.slice());
            return;
        } else search = search.toLowerCase();
        filterData.next(
            data.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    applyFilter() {
        if (this.dateRange.value.start) this.startDate = moment(this.dateRange.value.start).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        if (this.dateRange.value.end) this.endDate = moment(this.dateRange.value.end).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        this.catchmentAreas = this.catchmentCtrl.value;
        this.selectedProduct = this.productCtrl.value;
        this.selectedCategory = this.categoryCtrl.value;
        this.selectedStores = this.storeCtrl.value;
        this.getOrderReport();
    }

    clearFilter() {
        this.dateRange.reset();
        this.catchmentCtrl.reset();
        this.productCtrl.reset();
        this.categoryCtrl.reset();
        this.storeCtrl.reset();
        this.catchmentAreas = null;
        this.selectedProduct = null;
        this.selectedCategory = null;
        this.selectedStores = null;
        this.endDate = null;
        this.getOrderReport();
    }

    getOrderReport() {
        this.isLoading.next(true);
        this.analyticsService.productSale(
                this.startDate ? this.startDate : '2021-01-01T00:00:00Z',
                this.endDate,
                this.reportPeriod,
                this.catchmentAreas,
                this.selectedProduct,
                this.selectedCategory,
                this.selectedStores
            ).pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe(
                (data: any) => {

                    this.orderReportData = {
                        orderSeries: this.buildOrderSeries(data),
                        productSeries: this.buildProductSeries(data),
                        deliverySeries: this.buildDeliverySeries(data),
                        totalSeries: this.buildTotalSeries(data)
                    }
                    this.currency = data[0].currency;
                    this.orderReportOptions = {
                        //...  this.orderReportOptions,
                        chart: {
                            animations: {
                                speed: 400,
                                animateGradually: {
                                    enabled: false,
                                },
                            },
                            fontFamily: 'inherit',
                            foreColor: 'inherit',
                            width: '100%',
                            height: '100%',
                            type: 'area',
                            sparkline: {
                                enabled: true,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        colors: ['#A3BFFA', '#667EEA'],
                        fill: {
                            colors: ['#312E81'],
                        },
                        grid: {
                            show: true,
                            borderColor: '#334155',
                            padding: {
                                top: 10,
                                bottom: -40,
                                left: 0,
                                right: 0,
                            },
                            position: 'back',
                            xaxis: {
                                lines: {
                                    show: true,
                                },
                            },
                        },
                        series: this.orderReportData.orderSeries,
                        stroke: {
                            width: 2,
                        },
                        tooltip: {
                            followCursor: true,
                            theme: 'dark',
                            x: {
                                format: 'MMM dd, yyyy',
                            },
                            y: {
                                formatter: (value): string => `${value}`,
                            },
                        },
                        xaxis: {
                            axisBorder: {
                                show: false,
                            },
                            axisTicks: {
                                show: false,
                            },
                            crosshairs: {
                                stroke: {
                                    color: '#475569',
                                    dashArray: 0,
                                    width: 2,
                                },
                            },
                            labels: {
                                offsetY: -20,
                                style: {
                                    colors: '#CBD5E1',
                                },
                            },
                            tickAmount: 20,
                            tooltip: {
                                enabled: false,
                            },
                            type: 'datetime',
                        },
                        yaxis: {
                            axisTicks: {
                                show: false,
                            },
                            axisBorder: {
                                show: false,
                            },
                            tickAmount: 5,
                            show: false,
                        },
                    };

                    this.productChargeReportOptions = {
                        chart: {
                            animations: {
                                enabled: false
                            },
                            fontFamily: 'inherit',
                            foreColor: 'inherit',
                            height: '100%',
                            type: 'area',
                            sparkline: {
                                enabled: true
                            }
                        },
                        colors: ['#38BDF8'],
                        fill: {
                            colors: ['#38BDF8'],
                            opacity: 0.5
                        },
                        series: this.orderReportData.productSeries.series,
                        stroke: {
                            curve: 'smooth'
                        },
                        tooltip: {
                            followCursor: true,
                            theme: 'dark'
                        },
                        xaxis: {
                            type: 'category',
                            categories: this.orderReportData.productSeries.labels
                        },
                        yaxis: {
                            labels: {
                                formatter: (val): string => val.toString()
                            }
                        }
                    }

                    this.deliveryReportOptions = {
                        chart: {
                            animations: {
                                enabled: false
                            },
                            fontFamily: 'inherit',
                            foreColor: 'inherit',
                            height: '100%',
                            type: 'area',
                            sparkline: {
                                enabled: true
                            }
                        },
                        colors: ['#38BDF8'],
                        fill: {
                            colors: ['#38BDF8'],
                            opacity: 0.5
                        },
                        series: this.orderReportData.deliverySeries.series,
                        stroke: {
                            curve: 'smooth'
                        },
                        tooltip: {
                            followCursor: true,
                            theme: 'dark'
                        },
                        xaxis: {
                            type: 'category',
                            categories: this.orderReportData.deliverySeries.labels
                        },
                        yaxis: {
                            labels: {
                                formatter: (val): string => val.toString()
                            }
                        }
                    }

                    this.totalReportOptions = {
                        chart: {
                            animations: {
                                enabled: false
                            },
                            fontFamily: 'inherit',
                            foreColor: 'inherit',
                            height: '100%',
                            type: 'area',
                            sparkline: {
                                enabled: true
                            }
                        },
                        colors: ['#38BDF8'],
                        fill: {
                            colors: ['#38BDF8'],
                            opacity: 0.5
                        },
                        series: this.orderReportData.totalSeries.series,
                        stroke: {
                            curve: 'smooth'
                        },
                        tooltip: {
                            followCursor: true,
                            theme: 'dark'
                        },
                        xaxis: {
                            type: 'category',
                            categories: this.orderReportData.totalSeries.labels
                        },
                        yaxis: {
                            labels: {
                                formatter: (val): string => val.toString()
                            }
                        }
                    }
                },
                (error) => {
                    0
                }
            );
    }

    buildOrderSeries(data) {
        return {
            revenue: [
                {
                    name: 'Revenue',
                    data: data.map((s) => ({
                        x: new Date(s.createdAt),
                        y: s.totalCharge / 100,
                    })),
                },
            ],
            orders: [
                {
                    name: 'Orders',
                    data: data.map((s) => ({
                        x: new Date(s.createdAt),
                        y: s.sold,
                    })),
                },
            ],

            credits: [
                {
                    name: 'Credit',
                    data: data.map((s) => ({
                        x: new Date(s.createdAt),
                        y: s.totalCredit,
                    })),
                },
            ],

            deliveryCharge: [
                {
                    name: 'Delivery Fees',
                    data: data.map((s) => ({
                        x: new Date(s.createdAt),
                        y: s.deliveryCharge,
                    })),
                },
            ],
        };
    }

    buildProductSeries(data) {
        return {
            amount: data.reduce(function (prev, cur) { return prev + cur.productCharge; }, 0),
            labels: [
                moment().subtract(47, 'days').format('DD MMM') + ' - ' + moment().subtract(40, 'days').format('DD MMM'),
                moment().subtract(39, 'days').format('DD MMM') + ' - ' + moment().subtract(32, 'days').format('DD MMM'),
                moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
                moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
                moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
                moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
            ],
            series: [
                {
                    name: 'Net Product',
                    data: data.map(s => s.productCharge / 100)
                }
            ]
        }
    }

    buildDeliverySeries(data) {
        return {
            amount: data.reduce(function (prev, cur) { return prev + cur.deliveryCharge; }, 0),
            labels: [
                moment().subtract(47, 'days').format('DD MMM') + ' - ' + moment().subtract(40, 'days').format('DD MMM'),
                moment().subtract(39, 'days').format('DD MMM') + ' - ' + moment().subtract(32, 'days').format('DD MMM'),
                moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
                moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
                moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
                moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
            ],
            series: [
                {
                    name: 'Net Delivery',
                    data: data.map(s => s.deliveryCharge / 100)
                }
            ]
        }
    }

    buildTotalSeries(data) {
        return {
            amount: data.reduce(function (prev, cur) { return prev + cur.totalCharge; }, 0),
            labels: [
                moment().subtract(47, 'days').format('DD MMM') + ' - ' + moment().subtract(40, 'days').format('DD MMM'),
                moment().subtract(39, 'days').format('DD MMM') + ' - ' + moment().subtract(32, 'days').format('DD MMM'),
                moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
                moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
                moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
                moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
            ],
            series: [
                {
                    name: 'Net Total',
                    data: data.map(s => s.totalCharge / 100)
                }
            ]
        }
    }

    exportReport(type) {
        this.analyticsService.generateReport(type, 
            this.startDate ? this.startDate : '2021-01-01T00:00:00Z',
            this.endDate,
            this.reportPeriod,
            this.catchmentAreas,
            this.selectedProduct,
            this.selectedCategory,
            this.selectedStores
        ).subscribe((data: any) => {
            const blob = new Blob([data], {
                type: "application/vnd.ms-excel;charset=utf-8"
            });
            FileSaver.saveAs(blob, "Report.xls");
        });
    }
}
