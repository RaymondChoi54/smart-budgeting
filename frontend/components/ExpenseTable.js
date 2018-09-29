import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'
import fetch from 'node-fetch'
import {Doughnut, Bar} from 'react-chartjs-2';

import LayoutBar from '../components/LayoutBar'

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
    	this.handleSubmit = this.handleSubmit.bind(this)
    	this.sortFilter = this.sortFilter.bind(this)
    	this.state = {
    		header: ["Category", "Store", "Item", "Price", "Brand", "Size", "Unit", "Date", "Comment"],
	        loaded: false,
	        data: [],
	        edit: false,
	        editID: "",
	        delete: false,
	        url: Config.api + '/expenses/' + this.props.username + '?sort=date',
	        page: 1,
	        pages: 0,
	        budget: {
	        	budget: 0,
	        	expense: 0,
	        	categoryExpense: Array(Config.categories.length).fill(0),
				dailyExpense: []
	        },
	        dateMin: this.props.year + "-" + ("0" + this.props.month).slice(-2) + "-01",
	        dateMax: this.props.year + "-" + ("0" + this.props.month).slice(-2) + "-" + daysInMonth(this.props.year, this.props.month)
	    };
  	}

  	handleSubmit(e) {
	    e.preventDefault();

	    if(this.refs.category.value && this.refs.store.value && this.refs.item.value && this.refs.price.value && 
	    	this.refs.brand.value && this.refs.size.value && this.refs.unit.value && this.refs.date.value && 
	    	this.refs.comment.value && this.state.loaded && !this.state.edit) {

	    	fetch(Config.api + '/expenses/' + this.props.username, {
				method: 'post',
				mode: 'cors',
				headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
				body: JSON.stringify({
					category: this.refs.category.value,
					store: this.refs.store.value,
					item: this.refs.item.value,
					price: this.refs.price.value,
					brand: this.refs.brand.value,
					size: this.refs.size.value,
					unit: this.refs.unit.value,
					date: this.refs.date.value,
					comment: this.refs.comment.value
				})
			})
	    	.then(() => this.updateExpenses())
			.catch(function(err) {
				Router.push('/login');
			})
	    } else if(this.state.edit) {
	    	var changed = {}

	    	if(this.refs.category.value) {
	    		changed.category = this.refs.category.value
	    	}
	    	if(this.refs.store.value) {
	    		changed.store = this.refs.store.value
	    	}
	    	if(this.refs.item.value) {
	    		changed.item = this.refs.item.value
	    	}
	    	if(this.refs.price.value) {
	    		changed.price = this.refs.price.value
	    	}
	    	if(this.refs.brand.value) {
	    		changed.brand = this.refs.brand.value
	    	}
	    	if(this.refs.size.value) {
	    		changed.size = this.refs.size.value
	    	}
	    	if(this.refs.unit.value) {
	    		changed.unit = this.refs.unit.value
	    	}
	    	if(this.refs.date.value) {
	    		changed.date = this.refs.date.value
	    	}
	    	if(this.refs.category.value) {
	    		changed.comment = this.refs.comment.value
	    	}

	    	fetch(Config.api + '/expenses/' + this.props.username + '/' + this.state.editID, {
				method: 'put',
				mode: 'cors',
				headers: {'Content-Type':'application/json', 'x-access-token':this.props.token},
				body: JSON.stringify(changed)
			})
			.then(() => this.updateExpenses())
			.catch(function(err) {
				Router.push('/login');
			})
	    } else {
	    	alert("All columns need to be filled in");
	    }
	}

	editClass(id) {
		if(this.state.edit && this.state.editID == id) {
			return "edit"
		} else {
			return "notEdit"
		}
	}

	editButton(e, id) {
		e.preventDefault()

		if(this.state.edit && id == this.state.editID) {
			this.setState({
	  			edit: false,
	  			editID: id
	  		})
		} else if(this.state.delete) {
	    	fetch(Config.api + '/expenses/' + this.props.username + '/' + id, {
				method: 'delete',
				mode: 'cors',
				headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
			})
			.then(() => this.updateExpenses())
			.catch(function(err) {
				Router.push('/login');
			})
	    } else {
	    	if(!this.state.edit) {
				for(var i = 0; i < this.state.header.length; i++) {
					this.refs[this.state.header[i].toLowerCase()].value = ""
				}
			}
			this.setState({
	  			edit: true,
	  			editID: id
	  		})
		}
	}

	editDeleteButton(e, id) {
		e.preventDefault()

		this.setState({
  			delete: !this.state.delete
  		})
	}

	editDelete() {
		if(this.state.delete) {
			return "Delete"
		} else {
			return "Edit"
		}
	}

  	componentDidMount() {
  		this.setState({
  			loaded: true
  		}, function() {
			this.updateExpenses()
		})
  	}

  	sortFilter(e) {
  		if(e) {
			e.preventDefault();
		}

		var url = Config.api + '/expenses/' + this.props.username + '?sort=' + this.refs.sortBy.value

		if(this.refs.categoryFilter.value) {
			url = url + '&category=' + this.refs.categoryFilter.value
		}
		if(this.refs.storeFilter.value) {
			url = url + '&store=' + this.refs.storeFilter.value
		}
		if(this.refs.itemFilter.value) {
			url = url + '&item=' + this.refs.itemFilter.value
		}
		if(this.refs.priceFilter.value) {
			url = url + '&price=' + this.refs.priceFilter.value
		}
		if(this.refs.brandFilter.value) {
			url = url + '&brand=' + this.refs.brandFilter.value
		}
		if(this.refs.dateMin.value && this.refs.dateMax.value) {
			url = url + '&startdate=' + this.refs.dateMin.value + '&enddate=' + this.refs.dateMax.value
		}
		if(this.refs.orderBy.value) {
			url = url + '&orderby=' + this.refs.orderBy.value
		}

		if(e) {
			this.setState({
				url: url
			}, function() {
				this.updateExpenses()
			})
		} else {
			return url
		}
	}

	updateExpenses() {
		fetch(this.sortFilter(), {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			data: data.data,
			pages: data.pages
		}))
		.catch(function(err) {
			Router.push('/login');
		})

		fetch(Config.api + '/budget/' + this.props.username + '/' + this.props.year + '/' + this.props.month, {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			budget: data
		}))
		.catch(function(err) {
			console.log(err)
			Router.push('/login');
		})
	}

	dataToBarData(data) {
		var temp = new Array(data.length)
		for(var i = 0; i < data.length; i++) {
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
		      data: data
		    }
		  ]
		};
	}

	dataToPieData(labels, data) {
		var tempLabel = []
		var tempData = []

		for(var i = 0; i < data.length; i++) {
			if(data[i] != 0) {
				tempLabel.push(labels[i])
				tempData.push(data[i])
			}
		}

		return {
			labels: tempLabel,
			datasets: [{
				data: tempData,
				backgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"],
				hoverBackgroundColor: ["green", "red", "blue", "yellow", "orange", "brown", "olive", "violet", "aqua", "gold", "tan", "lime", "salmon", "grey"]
			}]
		}
	}

	render() {
		const options = {
		    legend: {
		        display: false,
		    },
		};

	    return (
	    	<div className="space">
		    	<div className="window barChart">
	    			<div className="bar">Daily Expenses</div>
	    			<div className="barDiv">
		    			<Bar
				          data={this.dataToBarData(this.state.budget.dailyExpense)}
				          width={100}
				          height={300}
				          options={
				          	{ maintainAspectRatio: false, legend: { display: false }}
				          }
				        />
					</div>
	    		</div>

	    		<div className="window pie">
	    			<div className="bar">Budget & Total Expenses</div>
	    			<div className="pieDiv">
						<Doughnut data={this.dataToPieData(['Remaining Budget', 'Total Expenses'], [(this.state.budget.budget - this.state.budget.expense), this.state.budget.expense])}/>
					</div>
	    		</div>

				<div className="window pie">
	    			<div className="bar">Expenses By Category</div>
	    			<div className="pieDiv">
		    			<Doughnut data={this.dataToPieData(Config.categories, this.state.budget.categoryExpense)} options={options}/>
					</div>
	    		</div>

	    		<div className="window">
	    			<div className="bar">Current Monthly Expenses</div>
		    		{Array(this.state.pages).fill(1).map((item, i) => <button key={i} className="pageButton" onClick={() => this.setState({ page: i + 1 }, function() { this.updateExpenses() })}>{i + 1}</button>)}
		    		<div className="dropdown">
			    		<button className="dropButton">Sort/Filter</button>
			    		<form onSubmit={this.sortFilter} className="sortFilter">
			    			<div className="headerMenu">Sort by</div>
							<select id="sort" name="sort" ref="sortBy" defaultValue="date">
								<option value="date">Date</option>
								<option value="price">Price</option>
								<option value="size">Size</option>
							</select><br/>
							<div className="headerMenu">Order by</div>
							<select id="order" name="order" ref="orderBy" defaultValue="des">
								<option value="desc">Descending</option>
								<option value="asc">Ascending</option>
							</select><br/>
							<div className="headerMenu">Filter by</div>
							<select ref="categoryFilter">
								<option value="">Category</option>
								{Config.categories.map((name, index) => <option key={index} value={index}>{name}</option>)}
							</select>
							<input type="text" ref="storeFilter" placeholder="store"/>
							<input type="text" ref="itemFilter" placeholder="item"/>
							<input type="number" ref="priceFilter" placeholder="price"/>
							<input type="text" ref="brandFilter" placeholder="brand"/><br/>
							<div className="headerMenu">Date range</div>
							<input type="date" ref="dateMin" defaultValue={this.state.dateMin}/>
							<input type="date" ref="dateMax" defaultValue={this.state.dateMax}/>
							<input type="submit" value="Submit"/>
						</form>
					</div>

			    	<form className="expense" onSubmit={this.handleSubmit}>
				    	<table>
							<tbody>
								<tr className="notEdit">
									<td>
										<select ref="category">
											{Config.categories.map((name, index) => <option key={index} value={index}>{name}</option>)}
										</select>
									</td>
						            <td><input type="text" ref="store" placeholder="store"/></td>
						            <td><input type="text" ref="item" placeholder="item"/></td>
						            <td><input type="number" ref="price" placeholder="price"/></td>
						            <td><input type="text" ref="brand" placeholder="brand"/></td>
						            <td><input type="number" ref="size" placeholder="size"/></td>
						            <td><input type="text" ref="unit" placeholder="unit"/></td>
						            <td><input type="date" ref="date"/></td>
						            <td><input type="text" ref="comment" placeholder="comment"/></td>
						            <td><input type="submit" value="Submit"/></td>
						        </tr>
								<tr className="notEdit">
									{this.state.header.map((element, index) => <th key={index}>{element}</th>)}
									<td><button onClick={(e) => this.editDeleteButton(e)}>Edit/Delete</button></td>
								</tr>
								{this.state.data.map((row, x) => <tr key={x} className={this.editClass(row._id)}>{this.state.header.map((element, y) => <td key={x + "," + y}>{convert(row, element)}</td>)}<td><button className="editBut" onClick={(e) => this.editButton(e, row._id)}>{this.editDelete()}</button></td></tr>)}
							</tbody>
						</table>
					</form>
				</div>
				<style jsx>{`
					.space {
						font-family: sans-serif;
						font-size: 13px;
						display: -webkit-flex;
					    -webkit-flex-flow: wrap;
					    display: flex;
					    flex-flow: wrap;
					    width: 100%;
					}

					.pie {
						max-width: calc(50% - 10px);
						width: 50%;
						margin-bottom: 20px;
						margin-right: 20px;
					}

					.barChart {
						margin-bottom: 20px;
					}

					.pie:nth-child(odd) {
						margin-right: 0px;
					}

					@media screen and (max-width: 1000px) {
						.pie {
							margin-right: 0px;
							max-width: 100%;
							width: 100%;
						}
					}

					.pieDiv {
						overflow: auto;
						margin: 10px;
					}

					.barDiv {
						overflow: auto;
						margin: 10px;
					}

					.bar {
						background: black;
						color: white;
						padding: 8px;
						border-radius: 1px;
						text-align: left;
					}

					.window {
						text-align: center;
						background: rgba(254, 254, 254, 0.8);
						box-shadow: 0px 0px 4px #888888;
						width: 100%;
						display: block;
					}

					.pageButton {
						float: left;
						margin-top: 5px;
						margin-left: 2px;
					}

					.headerMenu {
						background-color: black;
						color: white;
						width: 100%;
						margin: 0px;
						padding: 0px;
					}
					.dropdown {
						width: 125px;
						float: right;
						margin: 5px;
					}

					.dropButton {
						float: right;
					}

					.sortFilter {
						position: absolute;
						display: none;
						width: 125px;
						background: white;
						box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
    					z-index: 1;
    					text-align: center;
					}

					.dropdown:hover .sortFilter {
						display: block;
					}

					.expense {
						width: 100%;
						overflow: auto;
					}

					table {
					    font-family: arial, sans-serif;
					    border-collapse: collapse;
					    width: 100%;
					   	font-size: 12px;
					   	text-align: center;
					}

					tbody {
        				overflow: auto;
					}

					td, th {
					    border: 1px solid #dddddd;
					    text-align: left;
					    padding: 8px;
					}

					tr.notEdit:nth-child(even) {
						background: #CCC;
					}

					.edit {
						background-color: red;
					}

					input {
						width: 90%;
					}

					select {
						width: 90%;
					}

					.editBut {
						width: 95%;
					}

					select {
						width: 90%
					}
				`}</style>
			</div>
		)
	}
}