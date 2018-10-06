import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'
import {Doughnut, Bar} from 'react-chartjs-2';

import LayoutBar from '../components/LayoutBar'
import Window from '../components/Window'
import QuickView from '../components/QuickView'

import Router from 'next/router'

const names = [
	{ id: 'dashboard', name: 'Dashboard', on: true},
	{ id: 'profile-settings', name: 'Profile & Settings', on: false},
	{ id: 'current-month', name: 'Current Month', on: false},
	{ id: 'history', name: 'History', on: false},
	{ id: 'logout', name: 'Logout', on: false}
];

export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fullname: Cookies.get('fullname'),
			username: Cookies.get('username'),
			token: Cookies.get('token'),
			loaded: false,
			data: [],
			date: new Date().toISOString().slice(0, 10),
			stats: {
				categoryExpense: [],
				budgetGoal: 0,
				totDollars: 0,
				totExpenses: 0,
				avgBudget: 0,
				avgExpenses: 0,
				avgSpentDaily: 0,
				avgDiffBudget: 0,
				months: 0,
				maxCategory: 0,
				lastSixExpense: [],
				lastSixCategoryExpense: []
			}
		};
	}

	componentDidMount() {
		if(!this.state.fullname || !this.state.username || !this.state.token) {
			Router.push('/login');
		}
		this.setState({
			loaded: true
		})

		fetch(Config.api + '/expenses/' + this.state.username + '?page=1&pagelimit=25&sort=date&orderby=desc&enddate=' + this.state.date, {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.state.token},
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			data: data.data
		}))
		.catch(function(err) {
			console.log(err)
			Router.push('/login');
		})

		fetch(Config.api + '/budget/statistics/' + this.state.username, {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.state.token},
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			stats: data
		}))
		.catch(function(err) {
			console.log(err)
			Router.push('/login');
		})
	}

	pieGoalsMet() {
		return {
			labels: [
				'Success',
				'Fail'
			],
			datasets: [{
				data: [this.state.stats.budgetGoal, this.state.stats.months - this.state.stats.budgetGoal],
				backgroundColor: [
					'#FF6384',
					'#36A2EB'
				],
				hoverBackgroundColor: [
					'#FF6384',
					'#36A2EB'
				]
			}]
		};
	}

	pieCategory() {
		return {
			labels: Config.categories,
			datasets: [{
				data: this.state.stats.categoryExpense,
				backgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"],
				hoverBackgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"]
			}]
		};
	}

	bar6Month() {
		var temp = new Array(this.state.stats.lastSixExpense.length)
		for(var i = 0; i < this.state.stats.lastSixExpense.length; i++) {
			temp[i] = i + 1
		}

		return {
			labels: temp,
			datasets: [
				{
					backgroundColor: 'rgba(255,99,132,0.2)',
					borderColor: 'rgba(255,99,132,1)',
					borderWidth: 1,
					hoverBackgroundColor: 'rgba(255,99,132,0.4)',
					hoverBorderColor: 'rgba(255,99,132,1)',
					data: this.state.stats.lastSixExpense
				}
			]
		};
	}

	pie6MonthCategory() {
		return {
			labels: Config.categories,
			datasets: [{
				data: this.state.stats.lastSixCategoryExpense,
				backgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"],
				hoverBackgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"]
			}]
		};
	}

	render() {

		const options = {
			legend: {
				display: false,
			},
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 10,
					right: 10,
					top: 25,
					bottom: 10,
				},
			}
		};

		return (
			<LayoutBar config={names} name={this.state.fullname} barName="Dashboard">
				<div className="scroll">
					<div className="container">
						<div className="cube odd">
							<Window barName="Expense by Category">
								<Doughnut data={this.pieCategory()} height={250} width={250} options={options}/>
							</Window>
						</div>
						<div className="cube max">
							<Window barName="Goals Met">
								<Doughnut data={this.pieGoalsMet()} height={250} width={250} options={options}/>
							</Window>
						</div>
						<div className="cube odd even">
							<Window barName="Statistics">
								<ul>
									<li>Total Dollars Recorded: {this.state.stats.totDollars}</li>
									<li>Total Expenses Recorded: {this.state.stats.totExpenses}</li>
									<li>Average Budget: {this.state.stats.avgBudget}</li>
									<li>Average Expenses: {this.state.stats.avgExpenses}</li>
									<li>Average Daily Spending: {this.state.stats.avgSpentDaily}</li>
									<li>Most Spent Category: {Config.categories[this.state.stats.maxCategory]}</li>
								</ul>
							</Window>
						</div>
						<div className="rect max">
							<Window barName="Last 6 Months Expenses">
								<Bar data={this.bar6Month()} height={250} options={options}/>
							</Window>
						</div>
						<div className="cube">
							<Window barName="Last 6 Months Expenses by Category">
								<Doughnut data={this.pie6MonthCategory()} height={250} width={250} options={options}/>
							</Window>
						</div>
					</div>
				<div className="historyContainer">
					<Window barName="Last 25 Expenses">
						<QuickView data={this.state.data}/>
					</Window>
				</div>
				</div>
				<style jsx>{`

					ul {
						font-family: sans-serif;
						margin-top: 65px;
						padding: 0px;
						list-style: none;
						text-align: center;
					}

					.scroll {
						min-width: 630px;
						overflow: auto;
						overflow: visible;
					}

					.container {
						display: -webkit-flex;
						display: flex;
						-webkit-flex-flow: row wrap;
						flex-flow: row wrap;
						width: calc(100% - 310px);
						float: left;
					}

					.historyContainer {
						width: 290px;
						float: right;
					}

					.cube {
						height: 300px;
						width: 320px;
						margin-bottom: 20px;
					}

					.rect {
						height: 300px;
						width: 640px;
						margin-bottom: 20px;
					}

					@media (min-width: 850px) {
						.cube {
							width: 100%;
						}

						.rect {
							width: 100%;
						}
					}

					@media (min-width: 1210px) {
						.rect {
							-webkit-order: 2;
							order: 2;
						}

						.cube {
							min-width: 320px;
							width: calc(50% - 10px);
							-webkit-order: 1;
							order: 1;
						}

						.odd {
							margin-right: 20px;
						}
					}

					@media (min-width: 1550px) {
						.rect {
							min-width: 640px;
							width: calc(66.66% - 6.66px);
							-webkit-order: 1;
							order: 1;
						}

						.cube {
							min-width: 320px;
							width: calc(33.33% - 13.33px);
							-webkit-order: 1;
							order: 1;
						}

						.even {
							margin-right: 0px;
						}

						.max {
							margin-right: 20px;
						}
					}

				`}</style>
			</LayoutBar>
		)
	}
}
