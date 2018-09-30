import React from 'react'
import Cookies from 'js-cookie'

import LayoutBar from '../components/LayoutBar'
import Window from '../components/Window'
import RecentTable from '../components/RecentTable'

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
	    		<div className="container">
			        <Window barName={"Budget History for " + year}>
			        	{months.map((month, index) => (
			        		<div key={index} className="innerWindow">
					        	<Window key={index} barName={month + " Recent Budget History"}>
					        		<RecentTable key={index} year={year} month={index + 1} token={this.state.token} username={this.state.username}/>
					        		<button onClick={() => Router.push('/budget/' + year + '/' + (index + 1))}>Edit/View</button>
					        	</Window>
				        	</div>
			        	))}
			        </Window>
		        </div>
				<style jsx>{`
					.container {
						width: 100%;
						overflow: auto;
					}

					.innerWindow {
						padding: 25px;
						font-family: sans-serif;
						font-size: 13px;
					}

					.innerWindow:not(:last-child) {
						padding-bottom: 0;
					}

					button {
						margin: 5px;
					}
				`}</style>
			</LayoutBar>
		)
	}
}
