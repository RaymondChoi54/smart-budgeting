import React from 'react'
import fetch from 'node-fetch'
import Config from '../config'

import Router from 'next/router'

function convert(row, element) {
	if(element == "Date") {
		return new Date(row[element.toLowerCase()]).toUTCString().slice(0, -13)
	} else if(element == "Price") {
		return "$" + row[element.toLowerCase()]
	} else if(element == "Category") {
		var index = row[element.toLowerCase()]
		if(index < Config.categories.length) {
			return Config.categories[row[element.toLowerCase()]]
		}
		return "Error"
	} else {
		return row[element.toLowerCase()]
	}
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			headers: ["Category", "Store", "Item", "Price", "Brand", "Size", "Unit", "Date", "Comment"],
			expenses: [],
			dateMin: this.props.year + "-" + ("0" + this.props.month).slice(-2) + "-01",
			dateMax: this.props.year + "-" + ("0" + this.props.month).slice(-2) + "-" + daysInMonth(this.props.year, this.props.month)
		}
	}

	componentDidMount() {
		fetch(Config.api + '/expenses/' + this.props.username + '/?sort=date&orderby=desc&limit=4&startdate=' + this.state.dateMin + '&enddate=' + this.state.dateMax, {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.props.token}
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			expenses: data.data
		}))
		.catch(function(err) {
			console.log(err)
		})
	}

	render() {
		if(this.state.expenses.length == 0) {
			return (
				<div>
					{this.props.children}
				</div>
			)
		} else {
			return (
				<table>
					<tbody>
						<tr>
							{this.state.headers.map((header, index) => (<th key={index}>{header}</th>))}
						</tr>
						{this.state.expenses.map((expense, index) => (
							<tr key={index}>
								{this.state.headers.map((header, i) => (<td key={index + ',' + i}>{convert(expense, header)}</td>))}
							</tr>
						))}
					</tbody>
				    {this.props.children}
					<style jsx>{`
						table {
						    font-family: arial, sans-serif;
						    border-collapse: collapse;
						    width: 100%;
						   	font-size: 12px;
						   	text-align: center;
						}

						td, th {
						    border: 1px solid #dddddd;
						    text-align: left;
						    padding: 8px;
						}

						tr:nth-child(even) {
							background: #CCC;
						}

					`}</style>
				</table>
			)
		}
	}
}

