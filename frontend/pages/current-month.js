import React from 'react'
import Cookies from 'js-cookie'

import LayoutBar from '../components/LayoutBar'
import ExpenseTable from '../components/ExpenseTable'

import Router from 'next/router'

const names = [
	{ id: 'dashboard', name: 'Dashboard', on: false},
	{ id: 'profile-settings', name: 'Profile & Settings', on: false},
	{ id: 'current-month', name: 'Current Month', on: true},
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
	        data: []
	    };
  	}

  	componentDidMount() {
  		if(!this.state.fullname || !this.state.username || !this.state.token) {
  			Router.push('/login');
  			return;
  		}
  		this.setState({
  			loaded: true
  		})
  	}

	render() {
		return (
	    	<LayoutBar config={names} name={this.state.fullname} barName="Current Monthly Expenses">
		        <ExpenseTable username={this.state.username} token={this.state.token} year={new Date(Date.now()).getFullYear()} month={new Date(Date.now()).getMonth() + 1}/>
				<style jsx>{`
				`}</style>
			</LayoutBar>
		)
	}
}