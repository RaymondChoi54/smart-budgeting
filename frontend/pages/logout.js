import React from 'react'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'

import Router from 'next/router'

export default class extends React.Component {

	componentDidMount() {
		Cookies.remove('token');

		setTimeout(function() {
			Router.push('/login')
		}, 1000);
	}

	render() {
	    return (
	      	<Layout>
	      		Logging you out safely
			</Layout>
	    )
  	}
}