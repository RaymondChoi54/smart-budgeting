import React from 'react'
import Cookies from 'js-cookie'

import LayoutBar from '../components/LayoutBar'
import ExpenseTable from '../components/ExpenseTable'
import Window from '../components/Window'

import Router from 'next/router'

const names = [
	{ id: 'dashboard', name: 'Dashboard', on: false},
	{ id: 'profile-settings', name: 'Profile & Settings', on: false},
	{ id: 'current-month', name: 'Current Month', on: false},
	{ id: 'history', name: 'History', on: true},
	{ id: 'logout', name: 'Logout', on: false}
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const year = 2018

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
  		}
  		this.setState({
  			loaded: true
  		})
  	}

	render() {
		return (
	    	<LayoutBar config={names} name={this.state.fullname}>
		        <Window barName={"Budget History for " + year}>
		        	{months.map((month, index) => (
		        		<div className="innerWindow">
				        	<Window barName={month + " Budget History"}>
				        		Hello
				        	</Window>
			        	</div>

		        	))}
		        </Window>
				<style jsx>{`
					.innerWindow {
						padding: 25px;
					}

					.innerWindow:not(:last-child) {
						padding-bottom: 0;
					}
				`}</style>
			</LayoutBar>
		)
	}
}
