import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'
import fetch from 'node-fetch'

import LayoutBar from '../components/LayoutBar'

import Router from 'next/router'

function convert(row, element) {
	if(element == "Date") {
		return new Date(row[element.toLowerCase()]).toDateString()
	} else if(element == "Price") {
		return "$" + row[element.toLowerCase()]
	} else {
		return row[element.toLowerCase()]
	}
}

export default class extends React.Component {
	constructor(props) {
    	super(props)
    	this.handleSubmit = this.handleSubmit.bind(this)
    	this.state = {
    		header: ["Category", "Store", "Item", "Price", "Brand", "Size", "Unit", "Date", "Comment"],
	        loaded: false,
	        data: [],
	        edit: false,
	        editID: "",
	        delete: false
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
				headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
				body: JSON.stringify(changed)
			})
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
			.catch(function(err) {
				Router.push('/login');
			})
	    } else {
			for(var i = 0; i < this.state.header.length; i++) {
				this.refs[this.state.header[i].toLowerCase()].value = ""
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
  		})
  	}

	render() {

		fetch(Config.api + '/expenses/' + this.props.username, {
			method: 'get',
			mode: 'cors',
			headers: {'Content-Type':'application/json', 'x-access-token': this.props.token},
		})
		.then((res) => res.json())
		.then((data) => this.setState({
			data: data
		}))
		.catch(function(err) {
			console.log(err)
			Router.push('/login');
		})

	    return (
	    	<form onSubmit={this.handleSubmit}>
		    	<table>
					<tbody>
						<tr className="notEdit">
							<td><input type="text" ref="category" placeholder="category"/></td>
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
						{this.state.data.map((row, x) => <tr key={x} className={this.editClass(row._id)}>{this.state.header.map((element, y) => <td key={x + "," + y}>{convert(row, element)}</td>)}<td><button onClick={(e) => this.editButton(e, row._id)}>{this.editDelete()}</button></td></tr>)}
					</tbody>
				</table>
				<style jsx>{`
					table {
					    font-family: arial, sans-serif;
					    border-collapse: collapse;
					    width: 90%;
					   	font-size: 12px;
					}

					td, th {
					    border: 1px solid #dddddd;
					    text-align: left;
					    padding: 8px;
					}

					tr.notEdit:nth-child(even) {
						background: #CCC
					}

					.edit {
						background-color: red;
					}
				`}</style>
			</form>
		)
	}
}