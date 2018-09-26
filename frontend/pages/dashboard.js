import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'

import LayoutBar from '../components/LayoutBar'

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
	        loaded: false
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
	    	<LayoutBar config={names} name={this.state.fullname} barName="Dashboard">
				<p>This is the Dashboard</p>
				<style jsx>{`
					p {
						height: 1000px;
					}
				`}</style>
			</LayoutBar>
		)
	}
}
