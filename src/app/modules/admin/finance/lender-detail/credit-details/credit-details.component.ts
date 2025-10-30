import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FinanceService } from '../../finance.service';

@Component({
    selector: 'app-credit-details',
    templateUrl: './credit-details.component.html',
    styleUrls: ['./credit-details.component.scss'],
})
export class CreditDetailsComponent implements OnInit, OnChanges{
    @Input() creditData: any;

    incomeStabilityData: any;
    incomeLiquidityData: any;

    constructor(private financeService: FinanceService) {}

    ngOnInit(): void {}

    getColour(score) {
        if (score <= 20) {
            return 'warn';
        }

        if (score <= 70) {
            return 'accent';
        }

        return 'primary';
    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    ngOnChanges(changes) {
        console.log('creditData', this.creditData);

        const incomeStability = this.creditData.applicantScores.filter(
            (s) => s.applicantScoreType == 'incomeStability'
        );
        const incomeLiquidity = this.creditData.applicantScores.filter(
            (s) => s.applicantScoreType == 'incomeLiquidity'
        );

        this.incomeStabilityData = incomeStability
            .map((s) => ({
                score: s.score,
                years: this.round(s.periodDays / 365, 1),
                color: this.getColour(s.score),
            }))
            .sort(function (o1, o2) {
                return o1.years - o2.years;
            });

        this.incomeLiquidityData = incomeLiquidity
            .map((s) => ({
                score: s.score,
                years: this.round(s.periodDays / 365, 1),
                color: this.getColour(s.score),
            }))
            .sort(function (o1, o2) {
                return o1.years - o2.years;
            });
    }
}
